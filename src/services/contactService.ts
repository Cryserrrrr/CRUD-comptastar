import type { Contact, ContactFormData } from "../types";

const STORAGE_KEY = "contacts";

/**
 * Converts a civility to a standard format
 * @param {string} civility - The civility to convert
 * @returns {string} The converted civility
 */
const convertCivility = (civility: string): "mr" | "mrs" | "miss" => {
  const civilityMap: Record<string, "mr" | "mrs" | "miss"> = {
    monsieur: "mr",
    madame: "mrs",
    mademoiselle: "miss",
    mr: "mr",
    mrs: "mrs",
    miss: "miss",
  };
  return civilityMap[civility.toLowerCase()] || "mr";
};

/**
 * Validates the data of a CSV line
 * @param {string[]} values - The values of the CSV line
 * @returns {boolean} True if the data is valid, false otherwise
 */
const validateCSVData = (values: string[]): boolean => {
  if (values.length !== 6) return false;

  // Vérifier la civilité
  const validCivilities = [
    "monsieur",
    "madame",
    "mademoiselle",
    "mr",
    "mrs",
    "miss",
  ];
  if (!validCivilities.includes(values[0].toLowerCase())) return false;

  // Vérifier le prénom et le nom
  if (!values[1] || !values[2]) return false;

  // Vérifier l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(values[3])) return false;

  // Vérifier le téléphone (format international)
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(values[4].replace(/\s/g, ""))) return false;

  // Vérifier le pays
  if (!values[5]) return false;

  return true;
};

/**
 * The contact service
 * @namespace contactService
 */
export const contactService = {
  /**
   * Gets all contacts
   * @returns {Contact[]} The contacts
   */
  getAll: (): Contact[] => {
    const contacts = localStorage.getItem(STORAGE_KEY);
    return contacts ? JSON.parse(contacts) : [];
  },

  /**
   * Creates a new contact
   * @param {ContactFormData} contact - The contact data to create
   * @returns {Contact} The created contact
   */
  create: (contact: ContactFormData): Contact => {
    const contacts = contactService.getAll();
    const newContact: Contact = {
      ...contact,
      id: crypto.randomUUID(),
    };
    contacts.push(newContact);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    return newContact;
  },

  /**
   * Updates a contact
   * @param {string} id - The ID of the contact to update
   * @param {ContactFormData} contact - The contact data to update
   * @returns {Contact} The updated contact
   */
  update: (id: string, contact: ContactFormData): Contact => {
    const contacts = contactService.getAll();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Contact not found");

    const updatedContact: Contact = { ...contact, id };
    contacts[index] = updatedContact;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    return updatedContact;
  },

  /**
   * Deletes a contact
   * @param {string} id - The ID of the contact to delete
   */
  delete: (id: string): void => {
    const contacts = contactService.getAll();
    const filteredContacts = contacts.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredContacts));
  },

  /**
   * Imports contacts from a CSV file
   * @param {string} csvContent - The CSV content
   * @returns {Contact[]} The imported contacts
   */
  importFromCSV: (csvContent: string): Contact[] => {
    const lines = csvContent.split("\n");
    const headers = lines[0].split(",");
    const contacts: Contact[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      console.log(values);
      if (values.length === headers.length) {
        if (validateCSVData(values)) {
          const contact: Contact = {
            id: crypto.randomUUID(),
            civility: convertCivility(values[0]),
            firstName: values[2].trim(),
            lastName: values[1].trim(),
            email: values[3].trim(),
            phone: values[4].trim(),
            country: values[5].trim(),
          };
          console.log(contact);
          contacts.push(contact);
        } else {
          errors.push(`Ligne ${i + 1}: Données invalides`);
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(`Erreurs d'import :\n${errors.join("\n")}`);
    }

    const existingContacts = contactService.getAll();
    const allContacts = [...existingContacts, ...contacts];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allContacts));
    return contacts;
  },

  /**
   * Exports the contacts to a CSV file
   * @param {Contact[]} contacts - The contacts to export
   * @returns {string} The CSV content
   */
  exportToCSV: (contacts: Contact[]): string => {
    const headers = ["civilité", "prénom", "nom", "email", "téléphone", "pays"];
    const rows = contacts.map((contact) => [
      contact.civility,
      contact.firstName,
      contact.lastName,
      contact.email,
      contact.phone,
      contact.country,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    return csvContent;
  },
};
