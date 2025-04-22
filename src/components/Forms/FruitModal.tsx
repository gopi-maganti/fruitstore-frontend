import React, { useState, useEffect } from "react";
import "./FruitModal.scss";
import { FruitFormData, FruitModalProps } from "../../models/FruitManagement";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FruitModal: React.FC<FruitModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData = {},
}) => {
  const [form, setForm] = useState<FruitFormData>({
    name: "",
    description: "",
    color: "",
    size: "",
    has_seeds: false,
    weight: 0,
    price: 0,
    total_quantity: 0,
    available_quantity: 0,
    sell_by_date: "",
    image: null,
  });

  useEffect(() => {
    if (visible) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        color: initialData.color || "",
        size: initialData.size || "",
        has_seeds: initialData.has_seeds || false,
        weight: initialData.weight || 0,
        price: initialData.price || 0,
        total_quantity: initialData.total_quantity || 0,
        available_quantity:
          initialData.fruit_id != null
            ? initialData.available_quantity || 0
            : initialData.total_quantity || 0,
        sell_by_date: initialData.sell_by_date || "",
        image: null,
      });
    }
  }, [visible, initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "number"
        ? Number(value)
        : value;

    setForm((prev) => {
      const updated = { ...prev, [name]: val };
      if (
        name === "total_quantity" &&
        (!initialData.fruit_id || initialData.fruit_id === -1)
      ) {
        updated.available_quantity = Number(val);
      }
      return updated;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, image: e.target.files?.[0] || null });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        formData.append("image", value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    try {
      const isEdit = initialData?.fruit_id != null;

      const url = isEdit
        ? `http://localhost:5000/fruit/${initialData.fruit_id}`
        : "http://localhost:5000/fruit/add";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        toast.success(`✅ Fruit ${isEdit ? "updated" : "added"} successfully!`);
        onSubmit();
        onClose();
      } else {
        const err = await res.json();
        toast.error(`❌ ${err.error || "Something went wrong"}`);
      }
    } catch (error) {
      toast.error("❌ Network error. Please try again.");
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <ToastContainer />
        <h2>
          {initialData?.fruit_id
            ? "Edit Fruit"
            : initialData?.name
            ? "Clone Fruit"
            : "Add New Fruit"}
        </h2>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input name="color" value={form.color} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Size:</label>
            <select
              name="size"
              onChange={handleChange}
              value={form.size || ""}
              required
            >
              <option value="">-- Select Size --</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="weight"
              value={form.weight}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="total_quantity">Total Quantity</label>
            <input
              name="total_quantity"
              type="number"
              value={form.total_quantity}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sell_by_date">Sell By Date</label>
            <input
              name="sell_by_date"
              type="date"
              value={form.sell_by_date}
              onChange={handleChange}
            />
          </div>

          <div className="checkbox-group">
            <input
              name="has_seeds"
              type="checkbox"
              checked={form.has_seeds}
              onChange={handleChange}
            />
            <label htmlFor="has_seeds">Has Seeds</label>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image Upload</label>
            <input type="file" onChange={handleFileChange} />
          </div>
        </form>
        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose} className="secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FruitModal;
