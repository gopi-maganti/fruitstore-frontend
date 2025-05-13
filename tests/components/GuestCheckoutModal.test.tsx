import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GuestCheckoutModal from "../../src/components/Forms/GuestCheckoutModal";
import { UseCart } from "../../src/context/CartContext";
import axios from "axios";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock CartContext
vi.mock("../context/CartContext", () => ({
  UseCart: () => ({
    clearCart: vi.fn(),
  }),
}));

// Setup localStorage
beforeEach(() => {
  localStorage.setItem(
    "fruitstore_cart",
    JSON.stringify([
      { fruit_id: 1, quantity: 2, name: "Apple", price: 1.5 },
      { fruit_id: 2, quantity: 1, name: "Banana", price: 1.0 },
    ])
  );
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("GuestCheckoutModal", () => {
  it("submits order and shows success message", async () => {
    mockedAxios.post.mockImplementation((url) => {
      if (url.includes("/user/add")) return Promise.resolve({});
      if (url.includes("/cart/add")) return Promise.resolve({});
      if (url.includes("/order/add")) {
        return Promise.resolve({
          data: {
            order_id: 123,
            order_date: new Date().toISOString(),
            total_order_price: 5.0,
            items: [
              {
                fruit_name: "Apple",
                quantity: 2,
                price_by_fruit: 1.5,
                total_price: 3.0,
              },
              {
                fruit_name: "Banana",
                quantity: 1,
                price_by_fruit: 1.0,
                total_price: 1.0,
              },
            ],
          },
        });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });

    render(<GuestCheckoutModal onClose={() => {}} selectedCartIds={[1, 2]} />);

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "1234567890" },
    });

    fireEvent.click(screen.getByText("Submit Order"));

    await waitFor(() => {
      expect(
        screen.getByText(/Order Placed Successfully/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Order ID:/i)).toBeInTheDocument();
      expect(screen.getByText(/Total:/i)).toBeInTheDocument();
    });
  });
});
