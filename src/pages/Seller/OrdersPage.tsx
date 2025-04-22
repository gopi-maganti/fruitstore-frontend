import React from "react";
import SellerNavbar from "../../components/Navbar/SellerNavbar";
import OrdersTable from "../../components/DataTable/OrdersTable";

const Orders: React.FC = () => {
  return (
    <>
      <SellerNavbar />
      <OrdersTable />
    </>
  );
};

export default Orders;
