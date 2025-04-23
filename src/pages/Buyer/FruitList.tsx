// File: src/pages/FruitList.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UseCart } from "../../context/CartContext";
import { Fruit } from "../../models/FruitManagement";
import "react-toastify/dist/ReactToastify.css";

import BuyerNavbar from "../../components/Navbar/BuyerNavbar";
import "./FruitList.scss";

const FruitList = () => {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [selectedFruit, setSelectedFruit] = useState<Fruit | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { cart, setCart } = UseCart();

  useEffect(() => {
    fetch("http://localhost:5000/fruit/")
      .then((res) => res.json())
      .then((data) => setFruits(data));
  }, []);

  const addToCart = (fruit: Fruit, qty: number) => {
    const existing = cart.find((item) => item.fruit_id === fruit.fruit_id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item.fruit_id === fruit.fruit_id
          ? {
              ...item,
              quantity: Math.min(item.quantity + qty, fruit.available_quantity),
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          fruit_id: fruit.fruit_id,
          name: fruit.name,
          price: fruit.price,
          image_url: fruit.image_url,
          quantity: qty,
          info_id: fruit.info_id,
          available_quantity: fruit.available_quantity,
        },
      ];
    }

    localStorage.setItem("fruitstore_cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    toast.success(`${fruit.name} added to cart!`);
    setSelectedFruit(null);
  };

  return (
    <>
      <BuyerNavbar />
      <div className="fruit-container">
        <div className="fruit-grid">
          {fruits.map((fruit) => (
            <div
              key={fruit.fruit_id}
              className="fruit-card"
              onClick={() => {
                setSelectedFruit(fruit);
                setQuantity(1);
              }}
            >
              <img
                src={`http://localhost:5000${fruit.image_url}`}
                alt={fruit.name}
              />
              <h2>{fruit.name}</h2>
              <p>${fruit.price}</p>
              <p className="availability">
                Available: {fruit.available_quantity}
              </p>
              <button onClick={(e) => { e.stopPropagation(); addToCart(fruit, 1); }}>Add to Cart</button>
            </div>
          ))}
        </div>

        {selectedFruit && (
          <div
            className="modal-backdrop"
            onClick={() => setSelectedFruit(null)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-button"
                onClick={() => setSelectedFruit(null)}
              >
                &times;
              </button>
              <img
                src={`http://localhost:5000${selectedFruit.image_url}`}
                alt={selectedFruit.name}
              />
              <h2>{selectedFruit.name.toUpperCase()}</h2>
              <p>{selectedFruit.description}</p>
              <span className="fruit-info">
                <p>Seeds: {selectedFruit.has_seeds}</p>
                <p>Color: {selectedFruit.color}</p>
                <p>Size: {selectedFruit.size}</p>
              </span>
              <span className="fruit-price-availability">
                <p>Price: ${selectedFruit.price}</p>
                <p>Available: {selectedFruit.available_quantity}</p>
              </span>

              <div className="quantity-controls">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedFruit.available_quantity}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      setQuantity(
                        Math.min(selectedFruit.available_quantity, val)
                      );
                    }
                  }}
                />
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(selectedFruit.available_quantity, q + 1)
                    )
                  }
                >
                  +
                </button>
              </div>

              <button onClick={() => addToCart(selectedFruit, quantity)}>
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FruitList;
