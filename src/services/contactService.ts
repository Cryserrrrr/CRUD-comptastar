import type { Contact, ContactFormData } from "../types";

const STORAGE_KEY = "contacts";

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

export const contactService = {
  getAll: (): Contact[] => {
    const contacts = localStorage.getItem(STORAGE_KEY);
    return contacts ? JSON.parse(contacts) : [];
  },

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

  update: (id: string, contact: ContactFormData): Contact => {
    const contacts = contactService.getAll();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Contact not found");

    const updatedContact: Contact = { ...contact, id };
    contacts[index] = updatedContact;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    return updatedContact;
  },

  delete: (id: string): void => {
    const contacts = contactService.getAll();
    const filteredContacts = contacts.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredContacts));
  },

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
