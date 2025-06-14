import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ContactForm } from "../ContactForm";
import type { Contact, ContactFormData } from "../../types";

// Mock the useLanguage hook
vi.mock("../../context/LanguageContext", () => ({
  useLanguage: vi.fn(() => ({
    t: (key: string) => key,
  })),
}));

describe("ContactForm", () => {
  let mockOnSubmit: ReturnType<typeof vi.fn>;
  let mockOnCancel: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSubmit = vi.fn();
    mockOnCancel = vi.fn();
  });

  const fillForm = (formData: Partial<ContactFormData>) => {
    Object.entries(formData).forEach(([name, value]) => {
      const input = screen.getByLabelText(name);
      fireEvent.change(input, { target: { name, value } });
    });
  };

  it("should render empty form for new contact", () => {
    render(<ContactForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Check if all form fields are present
    expect(screen.getByLabelText("civility")).toBeInTheDocument();
    expect(screen.getByLabelText("firstName")).toBeInTheDocument();
    expect(screen.getByLabelText("lastName")).toBeInTheDocument();
    expect(screen.getByLabelText("email")).toBeInTheDocument();
    expect(screen.getByLabelText("phone")).toBeInTheDocument();
    expect(screen.getByLabelText("country")).toBeInTheDocument();

    // Check if add button is present
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("should render form with contact data for editing", () => {
    const contact: Contact = {
      id: "1",
      civility: "mr",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      country: "France",
    };

    render(
      <ContactForm
        contact={contact}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Check if form fields are filled with contact data
    expect(screen.getByLabelText("civility")).toHaveValue("mr");
    expect(screen.getByLabelText("firstName")).toHaveValue("John");
    expect(screen.getByLabelText("lastName")).toHaveValue("Doe");
    expect(screen.getByLabelText("email")).toHaveValue("john@example.com");
    expect(screen.getByLabelText("phone")).toHaveValue("1234567890");
    expect(screen.getByLabelText("country")).toHaveValue("France");

    // Check if save button is present
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("should call onSubmit with form data when adding a new contact", () => {
    render(<ContactForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const newContact: ContactFormData = {
      civility: "mr",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      country: "France",
    };

    fillForm(newContact);

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /add/i });
    fireEvent.click(submitButton);

    // Check if onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledWith(newContact);
  });

  it("should call onSubmit with updated data when editing a contact", () => {
    const contact: Contact = {
      id: "1",
      civility: "mr",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      country: "France",
    };

    render(
      <ContactForm
        contact={contact}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Update some fields
    const updatedData = {
      firstName: "Jane",
      email: "jane@example.com",
    };

    fillForm(updatedData);

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(submitButton);

    // Check if onSubmit was called with the updated data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      ...contact,
      ...updatedData,
      id: undefined, // id should be removed as it's not part of ContactFormData
    });
  });

  it("should call onCancel when cancel button is clicked", () => {
    render(<ContactForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Click cancel button
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Check if onCancel was called
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("should show validation errors for required fields", () => {
    render(<ContactForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Submit empty form
    const submitButton = screen.getByRole("button", { name: /add/i });
    fireEvent.click(submitButton);

    // Check if validation errors are displayed
    expect(screen.getByText("firstNameRequired")).toBeInTheDocument();
    expect(screen.getByText("lastNameRequired")).toBeInTheDocument();
    expect(screen.getByText("invalidEmail")).toBeInTheDocument();
    expect(screen.getByText("invalidPhone")).toBeInTheDocument();
    expect(screen.getByText("countryRequired")).toBeInTheDocument();

    // Check that onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
