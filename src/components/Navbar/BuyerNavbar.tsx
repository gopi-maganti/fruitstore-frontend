import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { UseCart } from "../../context/CartContext";
import userIcon from "../../assets/Navbar/user-icon-white.svg";
import cartIcon from "../../assets/Navbar/cart-icon.svg";
import "./BuyerNavbar.scss";

const BuyerNavbar = () => {
  const { cart, setCart } = UseCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const uniqueItemCount = cart.length;

  // Always sync cart from localStorage when dropdown opens
  useEffect(() => {
    if (showDropdown) {
      const stored = localStorage.getItem("fruitstore_cart");
      if (stored) {
        setCart(JSON.parse(stored));
      } else {
        setCart([]);
      }
    }
  }, [showDropdown, setCart]);

  const updateQuantity = (fruitId: number, delta: number) => {
    const updated = cart.map((item) =>
      item.fruit_id === fruitId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    localStorage.setItem("fruitstore_cart", JSON.stringify(updated));
    setCart(updated);
  };

  const setQuantity = (fruitId: number, quantity: number) => {
    const updated = cart.map((item) =>
      item.fruit_id === fruitId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    localStorage.setItem("fruitstore_cart", JSON.stringify(updated));
    setCart(updated);
  };

  const removeItem = (fruitId: number) => {
    const updated = cart.filter((item) => item.fruit_id !== fruitId);
    localStorage.setItem("fruitstore_cart", JSON.stringify(updated));
    setCart(updated);
  };

  return (
    <nav className="buyer-navbar">
      <div className="site-title">
        <Link to="/buyer/">Fruit Store</Link>
      </div>

      <div className="nav-links">
        <div
          className="cart-wrapper"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <Link to="/cart" className="cart-icon">
            <img src={cartIcon} alt="cart" />
            {uniqueItemCount > 0 && (
              <span className="cart-count">{uniqueItemCount}</span>
            )}
          </Link>

          {showDropdown && (
            <div className="cart-dropdown">
              {cart.length === 0 ? (
                <p className="empty-msg">Your cart is empty.</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.fruit_id} className="dropdown-item">
                      <img
                        src={`http://localhost:5000${item.image_url}`}
                        alt={item.name}
                      />
                      <div className="info">
                        <p title={item.name}>{item.name}</p>

                        <div className="quantity-controls">
                          <button
                            onClick={() => updateQuantity(item.fruit_id, -1)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            min={1}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) {
                                setQuantity(
                                  item.fruit_id,
                                  Math.min(item.available_quantity, val)
                                );
                              }
                            }}
                          />
                          <button
                            onClick={() => updateQuantity(item.fruit_id, 1)}
                          >
                            +
                          </button>
                          <button
                            className="remove"
                            onClick={() => removeItem(item.fruit_id)}
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link to="/cart" className="view-cart-link">
                    View Cart
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <div className="user-icon">
          <img src={userIcon} alt="user" />
        </div>
      </div>
    </nav>
  );
};

export default BuyerNavbar;
