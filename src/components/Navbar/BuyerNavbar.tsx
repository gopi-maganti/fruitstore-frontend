import { useState } from "react";
import { Link } from "react-router-dom";
import userIcon from "../../assets/Navbar/user-icon-white.svg";
import cartIcon from "../../assets/Navbar/cart-icon.svg";
import "./BuyerNavbar.scss";
import { useCart } from "../../context/CartContext";

const BuyerNavbar = () => {
  const { cart } = useCart();
  const uniqueItemCount = cart.length;
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="buyer-navbar">
      <div className="site-title">
        <Link to="/">FruitStore</Link>
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

          {showDropdown && cart.length > 0 && (
            <div className="cart-dropdown">
              {cart.map((item) => (
                <div key={item.fruit_id} className="dropdown-item">
                  <img
                    src={`http://localhost:5000${item.image_url}`}
                    alt={item.name}
                  />
                  <div className="info">
                    <p title={item.name}>{item.name}</p>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
              <Link to="/cart" className="view-cart-link">
                View Cart
              </Link>
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
