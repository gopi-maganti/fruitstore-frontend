import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import FruitModal from "../../src/components/Forms/FruitModal";
import { vi } from "vitest";

// Global fetch mock
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as any;

describe("FruitModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when visible is false", () => {
    render(
      <FruitModal
        visible={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={{}}
      />
    );
    expect(screen.queryByText(/Add New Fruit/i)).not.toBeInTheDocument();
  });

  it("renders all form fields when visible", () => {
    render(
      <FruitModal
        visible={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={{}}
      />
    );

    expect(screen.getByText(/Add New Fruit/i)).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Image Upload")).toBeInTheDocument();
  });

  it("fills all inputs and submits the form", async () => {
    (global.fetch as any) = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    const { container } = render(
      <FruitModal
        visible={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={{}}
      />
    );

    const textInputs = screen.getAllByRole("textbox"); // name, desc, color
    const numberInputs = screen.getAllByRole("spinbutton"); // weight, price, qty
    const dateInput = container.querySelector(
      'input[type="date"]'
    ) as HTMLInputElement;
    const checkbox = screen.getAllByRole("checkbox")[0];

    fireEvent.change(textInputs[0], { target: { value: "Apple" } }); // Name
    fireEvent.change(textInputs[1], { target: { value: "Fresh" } }); // Description
    fireEvent.change(textInputs[2], { target: { value: "Red" } }); // Color

    fireEvent.change(numberInputs[0], { target: { value: "0.3" } }); // Weight
    fireEvent.change(numberInputs[1], { target: { value: "1.99" } }); // Price
    fireEvent.change(numberInputs[2], { target: { value: "50" } }); // Total qty

    fireEvent.change(dateInput, { target: { value: "2025-12-31" } });
    fireEvent.click(checkbox); // Has Seeds

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("handles file upload", () => {
    const { container } = render(
      <FruitModal
        visible={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={{}}
      />
    );

    const file = new File(["hello"], "fruit.jpg", { type: "image/jpeg" });

    // Find file input by type
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files?.[0]).toBe(file);
  });

  it("shows error toast if API fails", async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Something went wrong" }),
      })
    );

    render(
      <FruitModal
        visible={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={{
          name: "Mango",
          description: "Sweet and yellow",
          color: "Yellow",
          weight: 0.4,
          price: 3.0,
          total_quantity: 50,
          available_quantity: 50,
          sell_by_date: "2025-10-01",
          has_seeds: true,
        }}
      />
    );

    fireEvent.click(screen.getByText("Submit"));

    // 👇 Search globally (document.body), not just screen container
    const errorToasts = await within(document.body).findAllByText(
      (_, node) => !!node?.textContent?.includes("Something went wrong")
    );

    expect(errorToasts.length).toBeGreaterThanOrEqual(1);
  });
});
