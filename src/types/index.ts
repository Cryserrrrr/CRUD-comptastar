export type Civility = "mr" | "mrs" | "miss";

export interface Contact {
  id: string;
  civility: Civility;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

export interface ContactFormData extends Omit<Contact, "id"> {}

export interface FormField {
  name: keyof ContactFormData;
  label: string;
  type: "text" | "email" | "tel" | "select";
  required?: boolean;
  fullWidth?: boolean;
  options?: Array<{ value: string; label: string }>;
}
