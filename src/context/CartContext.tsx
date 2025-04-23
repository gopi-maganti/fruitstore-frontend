import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem, CartContextType } from "../models/CartManagement";

const CartContext = createContext<CartContextType>({
  cart: [],
  setCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const syncCart = () => {
      try {
        const storedCart = JSON.parse(
          localStorage.getItem("fruitstore_cart") || "[]"
        );

        // 🔁 Force update even if content is same by reference
        setCart([...storedCart]);
      } catch (error) {
        console.error("Failed to sync cart from localStorage", error);
        setCart([]);
      }
    };

    // 🔄 Sync on back navigation or tab restore
    window.addEventListener("pageshow", syncCart);

    // 🔄 Initial mount as well
    syncCart();

    return () => window.removeEventListener("pageshow", syncCart);
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

export const UseCart = () => useContext(CartContext);
