import { useState } from "react";
import "./HamburgerMenu.scss";

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <div className="hamburger-menu">
      <button className="hamburger-icon" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`slide-menu ${open ? "open" : ""}`}>
        <ul>
          <li>
            <a href="/seller/dashboard">Fruit Management</a>
          </li>
          <li>
            <a href="/seller/orders">Orders</a>
          </li>
          <li>
            <a href="/seller/settings">Settings (TBD)</a>
          </li>
        </ul>
      </div>

      {open && <div className="overlay" onClick={toggleMenu}></div>}
    </div>
  );
};

export default HamburgerMenu;
