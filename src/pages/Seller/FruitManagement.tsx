import SellerNavbar from "../../components/Navbar/SellerNavbar";
import FruitTable from "../../components/DataTable/FruitTable";
import "./FruitManagement.scss";

const FruitManagement = () => {
  return (
    <div className="seller-dashboard">
      <div className="main-area">
        <SellerNavbar />
        <FruitTable />
      </div>
    </div>
  );
};

export default FruitManagement;
