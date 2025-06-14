import type { ContactFormData } from "../types";

/**
 * Regular expressions for validation
 */
export const VALIDATION_REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-]{10,}$/,
} as const;

/**
 * Trims all string values in the form data
 * @param {ContactFormData} data - The form data to trim
 * @returns {ContactFormData} The trimmed form data
 */
export const trimFormData = (data: ContactFormData): ContactFormData => {
  return {
    ...data,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    country: data.country.trim(),
  };
};

/**
 * Validates the form data
 * @param {ContactFormData} data - The form data to validate
 * @param {Function} t - Translation function
 * @returns {Record<string, string>} Object containing validation errors
 */
export const validateFormData = (
  data: ContactFormData,
  t: (key: string) => string
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const trimmedData = trimFormData(data);

  if (!trimmedData.firstName) {
    errors.firstName = t("firstNameRequired");
  }

  if (!trimmedData.lastName) {
    errors.lastName = t("lastNameRequired");
  }

  if (!VALIDATION_REGEX.email.test(trimmedData.email)) {
    errors.email = t("invalidEmail");
  }

  if (!VALIDATION_REGEX.phone.test(trimmedData.phone)) {
    errors.phone = t("invalidPhone");
  }

  if (!trimmedData.country) {
    errors.country = t("countryRequired");
  }

  return errors;
};
