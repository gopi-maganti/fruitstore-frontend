import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { UseCart } from "../../context/CartContext";
import { Fruit } from "../../models/FruitManagement";
import "react-toastify/dist/ReactToastify.css";

import BuyerNavbar from "../../components/Navbar/BuyerNavbar";
import "./FruitList.scss";

const FruitList = () => {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [selectedFruit, setSelectedFruit] = useState<Fruit | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    price: { enabled: false, min: "", max: "" },
    available_quantity: { enabled: false, min: "", max: "" },
  });

  const { cart, setCart } = UseCart();

  useEffect(() => {
    fetch("http://localhost:5000/fruit/")
      .then((res) => res.json())
      .then((data) => setFruits(data));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchFilteredFruits = async () => {
    const queryParams = new URLSearchParams();

    // Handle keyword/numeric query
    if (query.trim()) {
      const isNumeric = !isNaN(Number(query));
      if (isNumeric) {
        queryParams.append("value", query);
      } else {
        queryParams.append("search", query);
      }
    }

    // Handle independent filters
    Object.entries(filters).forEach(([key, config]) => {
      if (config.enabled) {
        if (config.min) queryParams.append(`${key}_min`, config.min);
        if (config.max) queryParams.append(`${key}_max`, config.max);
      }
    });

    try {
      const res = await fetch(
        `http://localhost:5000/fruit/search?${queryParams.toString()}`
      );
      const data = await res.json();
      setFruits(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to fetch fruits");
    }

    setShowFilters(false);
  };

  const handleClearFilters = async () => {
    setFilters({
      price: { enabled: false, min: "", max: "" },
      available_quantity: { enabled: false, min: "", max: "" },
    });
    setQuery("");
    try {
      const res = await fetch("http://localhost:5000/fruit/");
      const data = await res.json();
      setFruits(data);
    } catch (err) {
      toast.error("Failed to reload fruits");
    }
  };

  const addToCart = (fruit: Fruit, qty: number) => {
    const existing = cart.find((item) => item.fruit_id === fruit.fruit_id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item.fruit_id === fruit.fruit_id
          ? {
              ...item,
              quantity: Math.min(item.quantity + qty, fruit.available_quantity),
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          fruit_id: fruit.fruit_id,
          name: fruit.name,
          price: fruit.price,
          image_url: fruit.image_url,
          quantity: qty,
          info_id: fruit.info_id,
          available_quantity: fruit.available_quantity,
        },
      ];
    }

    localStorage.setItem("fruitstore_cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    toast.success(`${fruit.name} added to cart!`);
    setSelectedFruit(null);
  };

  return (
    <>
      <BuyerNavbar />

      <div className="search-filter-bar">
        <input
          placeholder="Search by value..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchFilteredFruits()}
        />
        <button onClick={fetchFilteredFruits}>Search</button>
        <div className="filter-container">
          <button
            className="filter-toggle"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            Filters ⬇
          </button>
          {showFilters && (
            <div className="filter-dropdown-panel" ref={dropdownRef}>
              {(
                ["price", "available_quantity"] as Array<keyof typeof filters>
              ).map((key) => (
                <div key={key} className="filter-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={filters[key].enabled}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], enabled: e.target.checked },
                        }))
                      }
                    />
                    {key === "price" ? "Price" : "Available Quantity"}
                  </label>
                  {filters[key].enabled && (
                    <div className="range-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters[key].min}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [key]: { ...prev[key], min: e.target.value },
                          }))
                        }
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters[key].max}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [key]: { ...prev[key], max: e.target.value },
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
              <div className="filter-actions">
                <button onClick={fetchFilteredFruits}>Apply</button>
                <button onClick={handleClearFilters} className="clear-btn">
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fruit-container">
        <div className="fruit-grid">
          {fruits.map((fruit) => (
            <div
              key={fruit.fruit_id}
              className="fruit-card"
              onClick={() => {
                setSelectedFruit(fruit);
                setQuantity(1);
              }}
            >
              <img
                src={`http://localhost:5000${fruit.image_url}`}
                alt={fruit.name}
              />
              <h2>{fruit.name}</h2>
              <p>${fruit.price}</p>
              <p className="availability">
                Available: {fruit.available_quantity}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(fruit, 1);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FruitList;
