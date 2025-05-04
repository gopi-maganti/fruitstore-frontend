import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrdersTable.scss";
import { GroupedOrder } from "../../models/OrderManagement";

const ITEMS_PER_PAGE = 5;

const OrdersTable: React.FC = () => {
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get("http://localhost:5000/order/grouped")
      .then((res) => setGroupedOrders(res.data))
      .catch((err) => console.error("Failed to fetch grouped orders", err));
  }, []);

  const totalPages = Math.ceil(groupedOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = groupedOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="grouped-orders-wrapper">
      <h2>Grouped Orders</h2>

      {paginatedOrders.map((group) => (
        <div key={group.parent_order_id} className="group-block">
          <div className="group-header">
            <span>
              <strong>Order ID:</strong> {group.parent_order_id}
            </span>
            <span>
              <strong>Date:</strong>{" "}
              {new Date(group.order_date).toLocaleString()}
            </span>
            <span>
              <strong>Order Total: </strong> ${group.orders.reduce((sum, item) => sum + (item.total_price ?? item.quantity * (item.price ?? 0)), 0).toFixed(2)}
            </span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Fruit</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Item Total</th>
              </tr>
            </thead>
            <tbody>
              {group.orders.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.fruit_name}</td>
                  <td>{item.size}</td>
                  <td>{item.quantity}</td>
                  <td>${Number(item.price || 0).toFixed(2)}</td>
                  <td>${Number(item.quantity * (item.price ?? 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersTable;
