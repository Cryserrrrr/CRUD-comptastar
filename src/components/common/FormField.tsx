import { useLanguage } from "../../context/LanguageContext";
import type { FormField as FormFieldType } from "../../types";

interface FormFieldProps {
  field: FormFieldType;
  value: string;
  error?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

/**
 * A reusable form field component
 * @param {FormFieldProps} props - The component props
 * @returns {JSX.Element} The form field component
 */
export function FormField({ field, value, error, onChange }: FormFieldProps) {
  const { t } = useLanguage();

  const commonClasses = `w-full px-3 py-2 bg-white border ${
    error ? "border-red-500" : "border-[#213547]"
  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#213547] focus:border-[#213547]`;

  return (
    <div className={field.fullWidth ? "" : "md:col-span-1"}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t(field.label)}
      </label>
      {field.type === "select" ? (
        <select
          name={field.name}
          value={value}
          onChange={onChange}
          className={commonClasses}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          name={field.name}
          value={value}
          onChange={onChange}
          className={commonClasses}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
