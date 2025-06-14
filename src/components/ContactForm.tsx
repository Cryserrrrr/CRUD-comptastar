import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import type { Contact, ContactFormData, FormField } from "../types";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { FormField as FormFieldComponent } from "./common/FormField";
import { validateFormData, trimFormData } from "../utils/validation";

/**
 * Props for the ContactForm component
 * @interface ContactFormProps
 * @property {Contact} [contact] - The contact to edit (optional)
 * @property {(data: ContactFormData) => void} onSubmit - Function to call when the form is submitted
 * @property {() => void} onCancel - Function to call when the form is cancelled
 */
interface ContactFormProps {
  contact?: Contact;
  onSubmit: (data: ContactFormData) => void;
  onCancel: () => void;
}

/**
 * Initial form data
 * @constant
 */
const INITIAL_FORM_DATA: ContactFormData = {
  civility: "mr",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
};

/**
 * Form field configuration
 * @constant
 */
const FORM_FIELDS: FormField[] = [
  {
    name: "civility",
    label: "civility",
    type: "select",
    options: [
      { value: "mr", label: "mr" },
      { value: "mrs", label: "mrs" },
      { value: "miss", label: "miss" },
    ],
    fullWidth: true,
  },
  {
    name: "firstName",
    label: "firstName",
    type: "text",
    required: true,
  },
  {
    name: "lastName",
    label: "lastName",
    type: "text",
    required: true,
  },
  {
    name: "email",
    label: "email",
    type: "email",
    required: true,
  },
  {
    name: "phone",
    label: "phone",
    type: "tel",
    required: true,
  },
  {
    name: "country",
    label: "country",
    type: "text",
    required: true,
  },
];

/**
 * A form component for creating and editing contacts
 * @param {ContactFormProps} props - The component props
 * @returns {JSX.Element} The contact form component
 */
export function ContactForm({ contact, onSubmit, onCancel }: ContactFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with contact data if editing
  useEffect(() => {
    if (contact) {
      const { id, ...contactData } = contact;
      setFormData(contactData);
    }
  }, [contact]);

  /**
   * Handles form submission
   * @param {React.FormEvent} e - The form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData, t);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(trimFormData(formData));
    }
  };

  /**
   * Handles input changes
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {FORM_FIELDS.map((field, index) => {
        if (field.name === "firstName" || field.name === "phone") {
          return (
            <div
              key={field.name}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <FormFieldComponent
                field={field}
                value={formData[field.name]}
                error={errors[field.name]}
                onChange={handleChange}
              />
              <FormFieldComponent
                field={FORM_FIELDS[index + 1]}
                value={formData[FORM_FIELDS[index + 1].name]}
                error={errors[FORM_FIELDS[index + 1].name]}
                onChange={handleChange}
              />
            </div>
          );
        }
        if (field.name === "lastName" || field.name === "country") {
          return null;
        }
        return (
          <FormFieldComponent
            key={field.name}
            field={field}
            value={formData[field.name]}
            error={errors[field.name]}
            onChange={handleChange}
          />
        );
      })}

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 bg-white border border-[#213547] text-[#213547] rounded-md hover:bg-gray-50"
        >
          <XMarkIcon className="h-5 w-5 mr-2" />
          {t("cancel")}
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-[#213547] text-white rounded-md hover:bg-[#213547]/90"
        >
          <CheckIcon className="h-5 w-5 mr-2" />
          {contact ? t("save") : t("add")}
        </button>
      </div>
    </form>
  );
}
