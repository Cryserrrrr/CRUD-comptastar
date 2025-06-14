import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ContactForm } from "./components/ContactForm";
import { ContactList } from "./components/ContactList";
import { LanguageSelector } from "./components/LanguageSelector";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { contactService } from "./services/contactService";
import type { Contact, ContactFormData } from "./types";
import { PlusIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

function AppContent() {
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    const loadedContacts = contactService.getAll();
    setContacts(loadedContacts);
  };

  const handleAddContact = () => {
    setSelectedContact(undefined);
    setIsFormVisible(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsFormVisible(true);
  };

  const handleDeleteContact = (id: string) => {
    contactService.delete(id);
    loadContacts();
    toast.success(t("contactDeleted"));
  };

  const handleSubmit = (data: ContactFormData) => {
    try {
      if (selectedContact) {
        contactService.update(selectedContact.id, data);
        toast.success(t("contactUpdated"));
      } else {
        contactService.create(data);
        toast.success(t("contactAdded"));
      }
      loadContacts();
      setIsFormVisible(false);
    } catch (error) {
      toast.error(t("error"));
    }
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedContacts = contactService.importFromCSV(content);
          loadContacts();
          toast.success(`${importedContacts.length} ${t("importSuccess")}`);
          event.target.value = "";
        } catch (error) {
          toast.error(t("importError"));
          event.target.value = "";
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col sm:py-12 sm:px-4">
      <div className="relative sm:px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-900 pl-4 sm:text-2xl sm:mb-0 mb-4 pl-0">
            {t("contactManager")}
          </h1>
          <div className="flex flex-row">
            <label className="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 bg-white border border-[#213547] text-[#213547] rounded-md hover:bg-gray-50 cursor-pointer mr-2 sm:mr-4 text-sm sm:text-base">
              <ArrowDownTrayIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              {t("importCSV")}
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
              />
            </label>
            <button
              onClick={handleAddContact}
              className="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 bg-[#213547] text-white rounded-md hover:bg-[#213547]/90 text-sm sm:text-base"
            >
              <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              {t("addContact")}
            </button>
          </div>
        </div>

        {isFormVisible ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {selectedContact ? t("editContact") : t("addContact")}
            </h2>
            <ContactForm
              contact={selectedContact}
              onSubmit={handleSubmit}
              onCancel={() => setIsFormVisible(false)}
            />
          </div>
        ) : (
          <ContactList
            contacts={contacts}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
          />
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      <LanguageSelector />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
