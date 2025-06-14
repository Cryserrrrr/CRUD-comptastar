# Gestionnaire de Contacts

Une application web React moderne et responsive pour gérer les contacts de manière simple et efficace.

## Fonctionnalités

- Création, lecture, mise à jour et suppression de contacts (CRUD)
- Interface responsive optimisée pour mobile et desktop
- Système de traduction simple (Français/Anglais)
- Validation des données avec des expressions régulières
- Import de contacts depuis un fichier CSV
- Interface utilisateur moderne avec Tailwind CSS
- Notifications avec React Toastify
- Stockage local des données

## Technologies utilisées

- React 18
- TypeScript
- Tailwind CSS pour le design responsive
- React Toastify pour les notifications
- Vite pour le build et le développement
- Heroicons pour les icônes
- i18n pour la gestion des traductions

## Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

## Installation

1. Clonez le dépôt :

```bash
git clone [URL_DU_REPO]
cd contact-manager
```

2. Installez les dépendances :

```bash
npm install
```

3. Lancez l'application en mode développement :

```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:5173](http://localhost:5173)

## Fonctionnalités détaillées

### Design Responsive

- Interface adaptative pour mobile et desktop
- Boutons et formulaires optimisés pour le tactile
- Mise en page fluide sur tous les appareils

### Système de Traduction

- Basculement simple entre Français et Anglais
- Sélecteur de langue accessible depuis n'importe quelle page
- Traductions intégrées pour tous les textes de l'interface

### Import CSV

- Support pour l'import de contacts via fichier CSV
- Format CSV standard avec en-têtes
- Validation des données lors de l'import
- Un exemple de fichier CSV est fourni dans le dossier `examples`

## Structure du projet

```
contact-manager/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── FormField.tsx
│   │   ├── ContactForm.tsx
│   │   ├── ContactList.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── Modal.tsx
│   │
│   ├── context/
│   │   └── LanguageContext.tsx
│   │
│   ├── services/
│   │   └── contactService.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── translations/
│   │   ├── fr.ts
│   │   └── en.ts
│   │
│   ├── utils/
│   │   └── validation.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── examples/
│   └── contacts.csv
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Format du fichier CSV pour l'import

Le fichier CSV doit suivre le format suivant :

```
civilité,prénom,nom,email,téléphone,pays
Monsieur,Durand,Jean,jean.durand@example.com,+33612345678,France
```

Un exemple de fichier CSV est disponible dans le dossier `examples/contacts.csv`.

## Fonctionnalités techniques

### Validation des données

- Email : format standard avec validation
- Téléphone : format international
- Champs obligatoires marqués
- Messages d'erreur en français et en anglais

### Stockage

- Données stockées localement dans le navigateur
- Persistance des données entre les sessions
- Export possible des données
