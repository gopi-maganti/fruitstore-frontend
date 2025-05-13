import { useState } from "react";
import axios from "axios";
import "./GuestCheckoutModal.scss";
import { UseCart } from "../../context/CartContext";

type GuestCheckoutModalProps = {
  onClose: () => void;
  selectedCartIds: number[];
  onSuccess?: () => void;
};

const GuestCheckoutModal = ({
  onClose,
  selectedCartIds,
  onSuccess,
}: GuestCheckoutModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
  });
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { clearCart } = UseCart();

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone_number) {
      alert("Please fill all fields before submitting.");
      return;
    }

    if (!formData.name.trim()) return alert("Name is required");
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return alert("Invalid email");
    if (!/^\d{10}$/.test(formData.phone_number))
      return alert("Phone must be 10 digits");

    try {
      const cart = JSON.parse(localStorage.getItem("fruitstore_cart") || "[]");
      const currentCartIds = cart.map((item: any) => item.fruit_id);
      const selectedItems = cart.filter((item: any) =>
        currentCartIds.includes(item.fruit_id)
      );

      // Create guest user (ignore if already exists)
      try {
        await axios.post("http://localhost:5000/user/add", formData);
      } catch (error: any) {
        if (
          !error?.response?.data?.message?.includes("already exists") &&
          error?.response?.status !== 409
        ) {
          throw error;
        }
      }

      // Add selected cart items for guest (user_id: -1)
      await Promise.all(
        selectedItems.map((item: any) =>
          axios.post("http://localhost:5000/cart/add", {
            user_id: -1,
            fruit_id: item.fruit_id,
            quantity: item.quantity,
          })
        )
      );

      // Create order for guest
      const orderRes = await axios.post("http://localhost:5000/order/add/-1", {
        guest_info: formData,
        cart_ids: currentCartIds,
      });

      clearCart();
      if (onSuccess) onSuccess();
      setOrderDetails(orderRes.data);
      setSuccess(true);
    } catch (error) {
      alert("Failed to place order");
      console.error(error);
    }
  };

  const downloadReceipt = () => {
    if (!orderDetails) return;

    const content = `Order Receipt\n\nOrder ID: ${
      orderDetails.order_id
    }\nDate: ${new Date(orderDetails.order_date).toLocaleString()}\nTotal: $${
      orderDetails.total_order_price
    }\n\nItems:\n${orderDetails.items
      .map(
        (item: any) =>
          `- ${item.fruit_name}: Qty ${item.quantity} x $${item.price_by_fruit} = $${item.total_price}`
      )
      .join("\n")}`;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `order_${orderDetails.order_id}_receipt.txt`;
    link.click();
  };

  return (
    <div
      className="guest-modal-backdrop"
      onClick={() => {
        if (!success) onClose();
      }}
    >
      <div className="guest-modal" onClick={(e) => e.stopPropagation()}>
        {success && orderDetails ? (
          <>
            <h2>Order Placed Successfully!</h2>
            <p>
              <strong>Order ID:</strong> {orderDetails.order_id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(orderDetails.order_date).toLocaleString()}
            </p>
            <p>
              <strong>Total:</strong> ${orderDetails.total_order_price}
            </p>
            <h3>Items:</h3>
            <ul>
              {orderDetails.items.map((item: any, idx: number) => (
                <li key={idx}>
                  {item.fruit_name} - Qty: {item.quantity} @ $
                  {item.price_by_fruit} = ${item.total_price}
                </li>
              ))}
            </ul>
            <button className="submit-btn" onClick={downloadReceipt}>
              Download Receipt
            </button>
            <button className="close-btn" onClick={onClose}>
              Close
            </button>
          </>
        ) : (
          <>
            <h2>Guest Checkout</h2>
            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
            />
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Order
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GuestCheckoutModal;
