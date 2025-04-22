import { createContext, useContext, useEffect, useState } from "react";
import { CartItem, CartContextType } from "../models/CartManagement";

const CartContext = createContext<CartContextType>({
  cart: [],
  setCart: () => {},
  clearCart: () => {}, // Add this
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("fruitstore_cart") || "[]");
    setCart(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("fruitstore_cart", JSON.stringify(cart));
  }, [cart]);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("fruitstore_cart");
  };

  return (
    <CartContext.Provider value={{ cart, setCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
