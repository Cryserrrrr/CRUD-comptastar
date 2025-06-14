import { useLanguage } from "../context/LanguageContext";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

/**
 * Props for the Modal component
 * @interface ModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal
 * @property {() => void} onClose - Function to call when the modal is closed
 * @property {() => void} onConfirm - Function to call when the action is confirmed
 * @property {string} title - The title displayed in the modal
 * @property {string} message - The message displayed in the modal
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

/**
 * Modal component for displaying confirmation dialogs
 * @param isOpen - Controls the visibility of the modal
 * @param onClose - Function to handle modal closing
 * @param onConfirm - Function to handle confirmation
 * @param title - Title of the modal
 * @param message - Message to display in the modal
 */
export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 bg-white border border-[#213547] text-[#213547] rounded-md hover:bg-gray-50"
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center px-4 py-2 bg-[#213547] text-white rounded-md hover:bg-[#213547]/90"
          >
            <CheckIcon className="h-5 w-5 mr-2" />
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
