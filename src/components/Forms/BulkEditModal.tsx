import React, { useEffect, useState } from "react";
import "./FruitModal.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FruitEditData } from "../../models/FruitManagement";

interface BulkEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedFruits: FruitEditData[];
}

const BulkEditModal: React.FC<BulkEditModalProps> = ({
  visible,
  onClose,
  onSuccess,
  selectedFruits,
}) => {
  const [formData, setFormData] = useState<
    Record<number, { price: string; total_quantity: string; error: string }>
  >({});
  const [deleteList, setDeleteList] = useState<number[]>([]);

  useEffect(() => {
    if (visible && selectedFruits.length > 0) {
      const initialForm: typeof formData = {};
      selectedFruits.forEach((fruit) => {
        initialForm[fruit.fruit_id] = {
          price: fruit.price.toString(),
          total_quantity: fruit.total_quantity.toString(),
          error: "",
        };
      });
      setFormData(initialForm);
      setDeleteList([]); // reset
    }
  }, [visible, selectedFruits]);

  const handleChange = (
    id: number,
    field: "price" | "total_quantity",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value, error: "" },
    }));
  };

  const toggleDelete = (id: number) => {
    setDeleteList((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    const success: string[] = [];
    const failed: string[] = [];

    const updated = { ...formData };

    console.log("Submitting edit for fruits:", selectedFruits);
    console.log("Fruits marked for delete:", deleteList);

    for (const fruit of selectedFruits) {
      const update = formData[fruit.fruit_id];
      const newPrice = parseFloat(update.price);
      const newTotalQty = parseInt(update.total_quantity);
      const soldQty = fruit.total_quantity - fruit.available_quantity;
      const newAvailable = newTotalQty - soldQty;

      if (
        isNaN(newPrice) ||
        newPrice <= 0 ||
        isNaN(newTotalQty) ||
        newTotalQty < 0
      ) {
        updated[fruit.fruit_id].error = "Invalid price or quantity.";
        failed.push(fruit.name);
        continue;
      }

      if (newAvailable < 0) {
        updated[fruit.fruit_id].error = "Cannot reduce below sold quantity.";
        failed.push(fruit.name);
        continue;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/fruit/${fruit.fruit_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              price: newPrice,
              total_quantity: newTotalQty,
              available_quantity: newAvailable,
            }),
          }
        );

        const resJson = await res.json();

        if (res.ok) {
          success.push(fruit.name);
        } else {
          updated[fruit.fruit_id].error = resJson?.error || "Server error.";
          failed.push(fruit.name);
        }
      } catch (err) {
        console.error("Update failed:", err);
        updated[fruit.fruit_id].error = "Network error.";
        failed.push(fruit.name);
      }
    }

    setFormData(updated);

    if (success.length > 0 && failed.length === 0) {
      toast.success("✅ All fruits updated successfully!");
      onClose();
      onSuccess();
    } else if (success.length > 0) {
      toast.warn(
        `✅ ${success.length} updated.\n❌ Failed: ${failed.join(", ")}`,
        { position: "top-right" }
      );
    } else if (failed.length > 0) {
      toast.error(`❌ Failed to update: ${failed.join(", ")}`);
    }
  };

  const handleDeleteSelected = async () => {
    let idsToDelete = deleteList;

    // If none selected, assume delete all
    if (idsToDelete.length === 0) {
      idsToDelete = selectedFruits.map((fruit) => fruit.fruit_id);
    }

    try {
      const res = await fetch("http://localhost:5000/fruit/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (res.ok) {
        const result = await res.json();
        toast.success(result.message || "Fruits deleted successfully");
        onSuccess(); // refresh fruit list
        onClose(); // close modal
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete fruits");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Unexpected error occurred");
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <ToastContainer />
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Bulk Edit Fruits</h2>

        {selectedFruits.map((fruit) => (
          <div key={fruit.fruit_id} className="edit-row">
            <input
              type="checkbox"
              onChange={() => toggleDelete(fruit.fruit_id)}
              checked={deleteList.includes(fruit.fruit_id)}
            />
            <label className="fruit-name">{fruit.name}</label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="New Price"
              value={formData[fruit.fruit_id]?.price || ""}
              onChange={(e) =>
                handleChange(fruit.fruit_id, "price", e.target.value)
              }
            />
            <input
              type="number"
              min="0"
              placeholder="New Quantity"
              value={formData[fruit.fruit_id]?.total_quantity || ""}
              onChange={(e) =>
                handleChange(fruit.fruit_id, "total_quantity", e.target.value)
              }
            />
            {formData[fruit.fruit_id]?.error && (
              <span className="error-text">
                {formData[fruit.fruit_id].error}
              </span>
            )}
          </div>
        ))}

        <div className="modal-actions" style={{ marginTop: "1rem" }}>
          <button onClick={handleSubmit}>Submit</button>
          <button
            onClick={handleDeleteSelected}
            className="danger"
            disabled={deleteList.length === 0}
          >
            Delete Selected
          </button>
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkEditModal;
