import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ContactList } from "../ContactList";
import type { Contact, Civility } from "../../types";

// Mock the useLanguage hook
vi.mock("../../context/LanguageContext", () => ({
  useLanguage: vi.fn(() => ({
    t: (key: string) => key,
  })),
}));

// Mock the contact service
vi.mock("../../services/contactService", () => ({
  contactService: {
    exportToCSV: vi.fn(),
  },
}));

describe("ContactList", () => {
  const mockContacts: Contact[] = [
    {
      id: "1",
      civility: "mr" as Civility,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      country: "France",
    },
  ];

  let mockOnEdit: ReturnType<typeof vi.fn>;
  let mockOnDelete: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnEdit = vi.fn();
    mockOnDelete = vi.fn();
  });

  it("should open delete modal when delete button is clicked", () => {
    render(
      <ContactList
        contacts={mockContacts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find and click the delete button
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    // Check if the confirmation modal is displayed
    expect(screen.getByText("deleteConfirmation")).toBeInTheDocument();
  });

  it("should call onDelete when deletion is confirmed", () => {
    render(
      <ContactList
        contacts={mockContacts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Click delete button
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    // Click confirm button in modal
    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Check if onDelete was called with the correct contact ID
    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  it("should close modal when cancel is clicked", () => {
    render(
      <ContactList
        contacts={mockContacts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Click delete button
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    // Click cancel button in modal
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Check if the modal is no longer visible
    expect(screen.queryByText("deleteConfirmation")).not.toBeInTheDocument();
    // Check that onDelete was not called
    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});
