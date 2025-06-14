import { useState } from "react";
import type { Contact } from "../types";
import { Modal } from "./Modal";
import { useLanguage } from "../context/LanguageContext";
import { contactService } from "../services/contactService";
import {
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

/**
 * Props for the ContactList component
 * @interface ContactListProps
 * @property {Contact[]} contacts - Array of contacts to display
 * @property {(contact: Contact) => void} onEdit - Function to call when a contact is edited
 * @property {(id: string) => void} onDelete - Function to call when a contact is deleted
 */
interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

type SortDirection = "asc" | "desc" | null;
type SortField = keyof Contact | null;

/**
 * Table header configuration
 * @constant
 */
const TABLE_HEADERS = [
  { key: "civility", label: "civility" },
  { key: "lastName", label: "lastName" },
  { key: "firstName", label: "firstName" },
  { key: "email", label: "email" },
  { key: "phone", label: "phone" },
  { key: "country", label: "country" },
  { key: "actions", label: "actions" },
] as const;

/**
 * A component that displays a list of contacts in a table format
 * @param {ContactListProps} props - The component props
 * @returns {JSX.Element} The contact list component
 */
export const ContactList = ({
  contacts,
  onEdit,
  onDelete,
}: ContactListProps) => {
  const { t } = useLanguage();
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set()
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  /**
   * Handles the click on the delete button
   * @param {Contact} contact - The contact to delete
   */
  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  };

  /**
   * Handles the confirmation of contact deletion
   */
  const handleConfirmDelete = () => {
    if (contactToDelete) {
      onDelete(contactToDelete.id);
      setDeleteModalOpen(false);
      setContactToDelete(null);
    }
  };

  /**
   * Handles the sorting of contacts
   * @param {string} field - The field to sort by
   */
  const handleSort = (field: string) => {
    if (field === "actions") return;

    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection((current) => {
        if (current === "asc") return "desc";
        if (current === "desc") return "asc";
        return "asc";
      });
    } else {
      // New field, start with ascending
      setSortField(field as keyof Contact);
      setSortDirection("asc");
    }
  };

  /**
   * Compares two values for sorting
   * @param {any} a - First value to compare
   * @param {any} b - Second value to compare
   * @returns {number} Comparison result
   */
  const compareValues = (a: any, b: any): number => {
    // Handle null/undefined values
    if (a === null || a === undefined) return 1;
    if (b === null || b === undefined) return -1;
    if (a === b) return 0;

    // Convert to strings for comparison
    const aStr = String(a).toLowerCase();
    const bStr = String(b).toLowerCase();

    // Use localeCompare for proper alphabetical sorting
    return aStr.localeCompare(bStr, "fr", { sensitivity: "base" });
  };

  /**
   * Sorts the contacts based on current sort field and direction
   */
  const sortedContacts = [...contacts].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    const comparison = compareValues(aValue, bValue);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  /**
   * Renders the sort icon for a column
   * @param {string} field - The field to render the sort icon for
   */
  const renderSortIcon = (field: string) => {
    if (field === "actions") return null;
    if (sortField !== field) return null;

    return sortDirection === "asc" ? (
      <ChevronUpIcon className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 ml-1" />
    );
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedContacts.size === sortedContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(sortedContacts.map((contact) => contact.id)));
    }
  };

  const handleExportSelected = () => {
    const contactsToExport = sortedContacts.filter((contact) =>
      selectedContacts.has(contact.id)
    );

    if (contactsToExport.length === 0) {
      return;
    }

    const csvContent = contactService.exportToCSV(contactsToExport);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "contacts.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleExportSelected}
          disabled={selectedContacts.size === 0}
          className={`inline-flex items-center px-3 py-2 bg-white border border-[#213547] text-[#213547] rounded-md hover:bg-gray-50 mr-2 sm:mr-0 text-sm sm:text-base ${
            selectedContacts.size === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ArrowUpTrayIcon className="h-4 w-4 mr-2" /> ({selectedContacts.size})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedContacts.size === sortedContacts.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-[#213547] border-gray-300 rounded focus:ring-[#213547]"
                />
              </th>
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(header.key)}
                >
                  <div className="inline-flex items-center">
                    {t(header.label)}
                    {renderSortIcon(header.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedContacts.map((contact) => (
              <tr key={contact.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedContacts.has(contact.id)}
                    onChange={() => handleSelectContact(contact.id)}
                    className="h-4 w-4 text-[#213547] border-gray-300 rounded focus:ring-[#213547]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {t(contact.civility)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {contact.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {contact.firstName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center text-[#213547] hover:text-[#213547]/80"
                  >
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    {contact.email}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center text-[#213547] hover:text-[#213547]/80"
                  >
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {contact.phone}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {contact.country}
                </td>
                <td className="py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(contact)}
                    className="inline-flex items-center px-3 py-1 bg-white border border-[#213547] text-[#213547] rounded-md hover:bg-gray-50 mr-4"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(contact)}
                    className="inline-flex items-center px-3 py-1 bg-white border border-[#213547] text-[#213547] rounded-md hover:bg-gray-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t("deleteConfirmation")}
        message={t("deleteConfirmationMessage")}
      />
    </>
  );
};
