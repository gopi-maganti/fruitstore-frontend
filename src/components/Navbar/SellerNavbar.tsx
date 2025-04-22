import UserIcon from "../../assets/Navbar/user-icon.svg?url";
import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";
import "./SellerNavbar.scss";

const SellerNavbar = () => {
  return (
    <nav className="seller-navbar">
      <HamburgerMenu />
      <div className="site-title">Fruit Basket - Seller</div>
      <div className="profile-icon">
        <img src={UserIcon} alt="User" />
      </div>
    </nav>
  );
};

export default SellerNavbar;
