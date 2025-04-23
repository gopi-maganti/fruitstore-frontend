import { useState, useEffect } from "react";
import "./Cart.scss";
import { useNavigate } from "react-router-dom";
import GuestCheckoutModal from "../../components/Forms/GuestCheckoutModal";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("fruitstore_cart") || "[]");
    setCartItems(items);
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    const updated = cartItems.map((item) =>
      item.fruit_id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    localStorage.setItem("fruitstore_cart", JSON.stringify(updated));
    setCartItems(updated);
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.fruit_id !== id);
    localStorage.setItem("fruitstore_cart", JSON.stringify(updated));
    setCartItems(updated);
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const setQuantity = (quantity: number) => {
    const updated = cartItems.map((item) =>
      item.fruit_id === item.fruit_id
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    localStorage.setItem("fruitstore_cart", JSON.stringify(updated));
    setCartItems(updated);
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <>
          <p>Your cart is empty.</p>
          <button className="continue-btn" onClick={() => navigate("/buyer/")}>
            Continue Shopping
          </button>
        </>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.fruit_id} className="cart-item">
              <div className="left">
                <img
                  src={`http://localhost:5000${item.image_url}`}
                  alt={item.name}
                />
                <div className="info">
                  <div
                    className="name"
                    title={item.name}
                    style={{
                      maxWidth: "100%",
                      fontSize: "1rem",
                      fontWeight: "600",
                      whiteSpace: "normal",
                    }}
                  >
                    {item.name}
                  </div>
                  <div className="price">${item.price}</div>
                </div>
              </div>

              <div className="controls">
                <button onClick={() => updateQuantity(item.fruit_id, -1)}>
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      setQuantity(Math.min(item.available_quantity, val));
                    }
                  }}
                />
                <button onClick={() => updateQuantity(item.fruit_id, 1)}>
                  +
                </button>
                <button
                  className="remove"
                  onClick={() => removeItem(item.fruit_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-total">Total: ${total.toFixed(2)}</div>
          <button onClick={() => setShowModal(true)}>
            Proceed to Checkout
          </button>
          {showModal && (
            <GuestCheckoutModal onClose={() => setShowModal(false)} />
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
