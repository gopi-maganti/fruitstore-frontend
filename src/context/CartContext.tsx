import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem, CartContextType } from "../models/CartManagement";

const CartContext = createContext<CartContextType>({
  cart: [],
  setCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCartState] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("fruitstore_cart");
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to load cart from localStorage", err);
      return [];
    }
  });

  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem("fruitstore_cart", JSON.stringify(cart));
      } else {
        localStorage.removeItem("fruitstore_cart");
      }
    } catch (err) {
      console.error("Failed to update cart in localStorage", err);
    }
  }, [cart]);

  useEffect(() => {
    const handlePageShow = () => {
      try {
        const stored = localStorage.getItem("fruitstore_cart");
        const parsed = stored ? JSON.parse(stored) : [];
        setCartState(parsed);
      } catch (err) {
        console.error("Failed to resync cart from localStorage", err);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const setCart = (items: CartItem[]) => {
    setCartState((prev) => {
      const prevStr = JSON.stringify(prev);
      const newStr = JSON.stringify(items);
      return prevStr !== newStr ? [...items] : prev;
    });
  };

  const clearCart = () => {
    setCartState([]);
    localStorage.removeItem("fruitstore_cart");
  };

  return (
    <CartContext.Provider value={{ cart, setCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const UseCart = () => useContext(CartContext);
