import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import BulkEditModal from '../../src/components/Forms/BulkEditModal'
import { vi } from 'vitest'

describe("BulkEditModal", () => {
  const mockFruits = [
    {
      fruit_id: 1,
      name: "Apple",
      price: 2.5,
      total_quantity: 10,
      available_quantity: 7,
    },
    {
      fruit_id: 2,
      name: "Banana",
      price: 1.5,
      total_quantity: 20,
      available_quantity: 20,
    },
  ];

  const onClose = vi.fn();
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render if not visible", () => {
    render(
      <BulkEditModal
        visible={false}
        onClose={onClose}
        onSuccess={onSuccess}
        selectedFruits={mockFruits}
      />
    );
    expect(screen.queryByText("Bulk Edit Fruits")).not.toBeInTheDocument();
  });

  it("renders correctly when visible", () => {
    render(
      <BulkEditModal
        visible={true}
        onClose={onClose}
        onSuccess={onSuccess}
        selectedFruits={mockFruits}
      />
    );
    expect(screen.getByText("Bulk Edit Fruits")).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("allows input value change", () => {
    render(
      <BulkEditModal
        visible={true}
        onClose={onClose}
        onSuccess={onSuccess}
        selectedFruits={mockFruits}
      />
    );

    const priceInputs = screen.getAllByPlaceholderText("New Price");
    const qtyInputs = screen.getAllByPlaceholderText("New Quantity");

    fireEvent.change(priceInputs[0], { target: { value: "3.5" } });
    fireEvent.change(qtyInputs[0], { target: { value: "15" } });

    expect((priceInputs[0] as HTMLInputElement).value).toBe("3.5");
    expect((qtyInputs[0] as HTMLInputElement).value).toBe("15");
  });

  it("enables delete button when checkbox is clicked", () => {
    render(
      <BulkEditModal
        visible={true}
        onClose={onClose}
        onSuccess={onSuccess}
        selectedFruits={mockFruits}
      />
    );

    const deleteButton = screen.getByText("Delete Selected") as HTMLButtonElement;
    expect(deleteButton.disabled).toBe(true);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    expect(deleteButton.disabled).toBe(false);
  });

  it("calls onClose when Cancel is clicked", () => {
    render(
      <BulkEditModal
        visible={true}
        onClose={onClose}
        onSuccess={onSuccess}
        selectedFruits={mockFruits}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows error if invalid price is entered and Submit is clicked", async () => {
    render(
      <BulkEditModal
        visible={true}
        onClose={onClose}
        onSuccess={onSuccess}
        selectedFruits={mockFruits}
      />
    );

    const priceInputs = screen.getAllByPlaceholderText("New Price");
    fireEvent.change(priceInputs[0], { target: { value: "-5" } });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Invalid price or quantity.")).toBeInTheDocument();
    });
  });
});
