export type Language = "fr" | "en";

export const translations = {
  fr: {
    // Common
    cancel: "Annuler",
    confirm: "Confirmer",
    save: "Enregistrer",
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    actions: "Actions",

    // Form labels
    civility: "Civilité",
    lastName: "Nom",
    firstName: "Prénom",
    email: "Email",
    phone: "Téléphone",
    country: "Pays",

    // Civility options
    mr: "Monsieur",
    mrs: "Madame",
    miss: "Mademoiselle",

    // Validation messages
    firstNameRequired: "Le prénom est requis",
    lastNameRequired: "Le nom est requis",
    invalidEmail: "Email invalide",
    invalidPhone: "Numéro de téléphone invalide",
    countryRequired: "Le pays est requis",

    // Modal messages
    deleteContact: "Supprimer le contact",
    deleteConfirmation: "Confirmer la suppression",
    deleteConfirmationMessage:
      "Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est irréversible.",

    // Notifications
    contactAdded: "Contact ajouté avec succès",
    contactUpdated: "Contact modifié avec succès",
    contactDeleted: "Contact supprimé avec succès",
    importSuccess: "contacts importés avec succès",
    importError: "Erreur lors de l'importation du fichier CSV",
    error: "Une erreur est survenue",

    // App specific
    contactManager: "Gestionnaire de Contacts",
    importCSV: "Importer CSV",
    addContact: "Ajouter un contact",
    editContact: "Modifier le contact",
    exportSelected: "Exporter la sélection",
  },
  en: {
    // Common
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    actions: "Actions",

    // Form labels
    civility: "Civility",
    lastName: "Last Name",
    firstName: "First Name",
    email: "Email",
    phone: "Phone",
    country: "Country",

    // Civility options
    mr: "Mr",
    mrs: "Mrs",
    miss: "Miss",

    // Validation messages
    firstNameRequired: "First name is required",
    lastNameRequired: "Last name is required",
    invalidEmail: "Invalid email address",
    invalidPhone: "Invalid phone number",
    countryRequired: "Country is required",

    // Modal messages
    deleteContact: "Delete Contact",
    deleteConfirmation: "Confirm Deletion",
    deleteConfirmationMessage:
      "Are you sure you want to delete this contact? This action cannot be undone.",

    // Notifications
    contactAdded: "Contact added successfully",
    contactUpdated: "Contact updated successfully",
    contactDeleted: "Contact deleted successfully",
    importSuccess: "contacts imported successfully",
    importError: "Error importing CSV file",
    error: "An error occurred",

    // App specific
    contactManager: "Contact Manager",
    importCSV: "Import CSV",
    addContact: "Add Contact",
    editContact: "Edit Contact",
    exportSelected: "Export Selected",
  },
} as const;
