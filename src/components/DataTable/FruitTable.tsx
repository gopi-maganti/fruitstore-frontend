import { useEffect, useState } from "react";
import "./FruitTable.scss";
import { Fruit } from "../../models/FruitManagement";
import FruitModal from "../Forms/FruitModal";
import BulkEditModal from "../Forms/BulkEditModal";
import Pagination from "../Paginator/Pagination";

const FruitTable = () => {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [selectedFruitIds, setSelectedFruitIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<Partial<Fruit> | null>(null);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    fetchFruits();
  }, []);

  const fetchFruits = () => {
    fetch("http://localhost:5000/fruit/")
      .then((res) => res.json())
      .then((data) => setFruits(data))
      .catch((err) => console.error("Failed to load fruits", err));
  };

  const paginatedFruits = fruits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = () => {
    setModalData(null);
    setShowModal(true);
  };

  const handleClone = () => {
    const fruit = fruits.find((f) => f.fruit_id === selectedFruitIds[0]);
    if (fruit) {
      setModalData({
        ...fruit,
        name: `${fruit.name}`,
        total_quantity: 0,
        available_quantity: 0,
        sell_by_date: "",
      });
      setShowModal(true);
    }
  };

  const handleEdit = () => {
    if (selectedFruitIds.length > 0) {
      setShowModal(false);
      setShowBulkEdit(true);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:5000/fruit/search?value=${query}`
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        setFruits(data);
      } else {
        setFruits([]);
        alert("No matching fruits found.");
      }
    } catch (error) {
      console.error("Search failed", error);
      alert("Error fetching search results");
    }
  };

  const toggleCheckbox = (id: number) => {
    setSelectedFruitIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="fruit-table-wrapper">
      <div className="top-bar">
        <h1>Fruit Management</h1>
      </div>

      <div className="search-bar">
        <input
          placeholder="Search by price, weight, total/available quantity..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="actions">
        <button className="btn" onClick={handleAdd}>
          Add
        </button>

        <button
          className="btn"
          disabled={selectedFruitIds.length !== 1}
          onClick={handleClone}
        >
          Clone
        </button>

        <button
          className="btn"
          disabled={selectedFruitIds.length === 0}
          onClick={handleEdit}
        >
          Edit
        </button>
      </div>

      <div className="pagination-bar">
        <span>{fruits.length} results found</span>
        <Pagination
          currentPage={currentPage}
          totalItems={fruits.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Color</th>
            <th>Seeds</th>
            <th>Size</th>
            <th>Price</th>
            <th>Total Quantity</th>
            <th>Available Quantity</th>
          </tr>
        </thead>
        <tbody>
          {paginatedFruits.length === 0 ? (
            <tr>
              <td colSpan={10} className="no-results">
                No fruits found
              </td>
            </tr>
          ) : (
            paginatedFruits.map((fruit) => (
              <tr key={fruit.fruit_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedFruitIds.includes(fruit.fruit_id)}
                    onChange={() => toggleCheckbox(fruit.fruit_id)}
                  />
                </td>
                <td>{fruit.fruit_id}</td>
                <td>
                  <img
                    src={`http://localhost:5000${fruit.image_url}`}
                    alt={fruit.name}
                    className="fruit-thumbnail"
                  />
                </td>
                <td>{fruit.name}</td>
                <td>{fruit.color}</td>
                <td>{fruit.has_seeds ? "Yes" : "No"}</td>
                <td>{fruit.size}</td>
                <td>${fruit.price.toFixed(2)}</td>
                <td>{fruit.total_quantity}</td>
                <td>{fruit.available_quantity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <FruitModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => {
          setShowModal(false);
          fetch("http://localhost:5000/fruit/")
            .then((res) => res.json())
            .then((data) => setFruits(data));
          setSelectedFruitIds([]);
        }}
        initialData={modalData || {}}
      />

      <BulkEditModal
        visible={showBulkEdit}
        onClose={() => setShowBulkEdit(false)}
        selectedFruits={fruits.filter((f) =>
          selectedFruitIds.includes(f.fruit_id)
        )}
        onSuccess={() => {
          setShowBulkEdit(false);
          fetch("http://localhost:5000/fruit/")
            .then((res) => res.json())
            .then((data) => setFruits(data));
          setSelectedFruitIds([]);
        }}
      />
    </div>
  );
};

export default FruitTable;
