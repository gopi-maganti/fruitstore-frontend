import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";

import FruitManagement from "./pages/Seller/FruitManagement";
import FruitList from "./pages/Buyer/FruitList";
import Cart from "./pages/Buyer/Cart";
import OrdersTable from "./components/DataTable/OrdersTable";

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Buyer Routes */}
        <Route path="/buyer/" element={<FruitList />} />
        <Route path="/cart" element={<Cart />} />

        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={<FruitManagement />} />
        <Route path="/seller" element={<Navigate to="/seller/dashboard" />} />
        <Route path="/seller/orders" element={<OrdersTable />} />

        {/* Redirect to Buyer Home */}

        {/* Fallback */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        theme="colored"
      />
    </CartProvider>
  );
}

export default App;
