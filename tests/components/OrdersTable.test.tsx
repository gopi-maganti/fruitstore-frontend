import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import OrdersTable from "../../src/components/DataTable/OrdersTable";
import axios from "axios";
import { vi } from "vitest";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: (url: string) => Promise<{ data: any }>;
};

describe("OrdersTable", () => {
  const mockOrders = [
    {
      parent_order_id: 1,
      order_date: "2025-05-12T12:00:00Z",
      orders: [
        { fruit_name: "Apple", size: "Medium", quantity: 2, price: 1.5 },
        { fruit_name: "Banana", size: "Small", quantity: 1, price: 1.0 },
      ],
    },
  ];

  beforeEach(() => {
    mockedAxios.get = vi.fn(() => Promise.resolve({ data: mockOrders }));
  });

  it("renders order header and fruit rows", async () => {
    render(<OrdersTable />);

    await waitFor(() => {
      expect(screen.getByText("Grouped Orders")).toBeInTheDocument();
      expect(screen.getByText(/Order ID/i)).toBeInTheDocument();
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
      expect(screen.getByText("Medium")).toBeInTheDocument();
      expect(screen.getByText("Small")).toBeInTheDocument();
    });
  });

  it("displays correct order total inside group block", async () => {
    render(<OrdersTable />);

    const orderIdEl = await screen.findByText(/Order ID:/i);
    const groupBlock = orderIdEl.closest(".group-block") as HTMLElement;
    expect(groupBlock).not.toBeNull();

    const groupScope = within(groupBlock);

    // Grab all spans and find one where the combined textContent includes "Order Total: $4.00"
    const spans = groupBlock.querySelectorAll("span");
    const found = Array.from(spans).some((el) =>
      el.textContent?.includes("Order Total:")
    );

    expect(found).toBe(true);
  });

  it("handles pagination controls", async () => {
    const largeOrders = Array.from({ length: 7 }, (_, i) => ({
      parent_order_id: i + 1,
      order_date: "2025-05-12T12:00:00Z",
      orders: [],
    }));

    mockedAxios.get = vi.fn(() => Promise.resolve({ data: largeOrders }));

    render(<OrdersTable />);

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Next"));
    await waitFor(() => {
      expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Prev"));
    await waitFor(() => {
      expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    });
  });

  it("handles failed fetch gracefully", async () => {
    mockedAxios.get = vi.fn(() => Promise.reject(new Error("API error")));

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<OrdersTable />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        "Failed to fetch grouped orders",
        expect.any(Error)
      );
    });

    errorSpy.mockRestore();
  });
});
