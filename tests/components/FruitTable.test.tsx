import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FruitTable from "../../src/components/DataTable/FruitTable";
import { vi } from "vitest";

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
) as any;

describe("FruitTable", () => {
  it("renders header and buttons", () => {
    render(<FruitTable />);
    expect(screen.getByText("Fruit Management")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getByText("Clone")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("displays no results row when no fruits found", async () => {
    render(<FruitTable />);
    await waitFor(() => {
      expect(screen.getByText("No fruits found")).toBeInTheDocument();
    });
  });

  it("calls fetchFruits on mount", async () => {
    const mockData = [
      {
        fruit_id: 1,
        name: "Apple",
        color: "Red",
        has_seeds: true,
        size: "Medium",
        price: 2.5,
        total_quantity: 10,
        available_quantity: 8,
        image_url: "/apple.jpg",
      },
    ];

    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    );

    render(<FruitTable />);

    await waitFor(() => {
      expect(screen.getByText("Apple")).toBeInTheDocument();
    });
  });
});
