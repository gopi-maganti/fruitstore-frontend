export interface OrderSummary {
    order_id: number;
    total_order_price: number;
    order_date: string;
    items: {
      fruit_name: string;
      quantity: number;
      price_by_fruit: number;
      total_price: number;
    }[];
  }

export interface OrderItem {
    fruit_id: number;
    fruit_name: string;
    size: string;
    quantity: number;
    price: number;
    total_price: number;
  }

  export interface GroupedOrder {
    parent_order_id: number;
    user_name: string;
    order_date: string;
    orders: {
      fruit_name: string;
      size: string;
      quantity: number;
      price?: number;
      total_price?: number;
    }[];
  }
  