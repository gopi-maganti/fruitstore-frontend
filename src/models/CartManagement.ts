export interface CartItem {
    fruit_id: number;
    info_id: number;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
  }

export interface CartContextType {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  clearCart: () => void;
}