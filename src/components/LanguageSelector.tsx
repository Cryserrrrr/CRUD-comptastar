import React from "react";
import { useLanguage } from "../context/LanguageContext";

/**
 * A component for selecting the application language
 * @returns {JSX.Element} The language selector component
 */
export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  /**
   * Handles the language change
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event
   */
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as "fr" | "en");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="px-3 py-2 bg-white border border-[#213547] text-[#213547] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#213547] focus:border-[#213547] text-sm sm:text-base"
      >
        <option value="fr">FR</option>
        <option value="en">EN</option>
      </select>
    </div>
  );
}
