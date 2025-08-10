# Dynamic Form Builder

A powerful and intuitive dynamic form builder application built with React, TypeScript, and Redux. This tool allows users to seamlessly create custom forms with various field types, configure advanced validation, reorder fields with drag-and-drop, and preview the final result in real-time. All form configurations are persisted in the browser's `localStorage`.

[![React](https://img.shields.io/badge/React-v18.2.0-blue?logo=react&style=for-the-badge)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.2.2-blue?logo=typescript&style=for-the-badge)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-v9.1.2-purple?logo=redux&style=for-the-badge)](https://redux-toolkit.js.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-v5.15.20-blue?logo=mui&style=for-the-badge)](https://mui.com/)
[![Vite](https://img.shields.io/badge/Vite-v5.3.1-yellowgreen?logo=vite&style=for-the-badge)](https://vitejs.dev/)

### **Live Demo: [https://upliance-ai-form.vercel.app/](https://upliance-ai-form.vercel.app/)**



---

## Features

-   **Dynamic Form Creation**: Build forms on the fly by adding and configuring fields.
-   **Multiple Field Types**: Supports a wide range of inputs: Text, Number, Textarea, Select, Radio, Checkbox, and Date.
-   **Detailed Field Configuration**: Customize each field with a user-defined **Label**, a **Required** toggle, and a **Default Value**.
-   **Advanced Validation**: Set granular validation rules for fields, including "not empty," "minimum/maximum length," and "email format."
-   **Drag & Drop Interface**: Easily reorder form fields using a smooth and intuitive drag-and-drop system.
-   **Derived Fields**: A powerful feature to define fields whose values are automatically calculated based on others (e.g., computing **Age** from a **Date of Birth**).
-   **Interactive Preview**: Instantly preview the form as it would appear to an end-user, with full validation logic enabled.
-   **Local Persistence**: All created form schemas are automatically saved to `localStorage`, ensuring your work is never lost.
-   **Form Management Dashboard**: View a list of all saved forms with options to **Preview**, **Edit**, or **Delete** them.
-   **Responsive Design**: A clean and modern UI built with Material-UI that works seamlessly on all screen sizes.

---

## Technical Stack

-   **Frontend**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
-   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
-   **UI Library**: [Material-UI (MUI)](https://mui.com/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **Drag & Drop**: [Dnd Kit](https://dndkit.com/)
-   **Build Tool**: [Vite](https://vitejs.dev/)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

You will need [Node.js](https://nodejs.org/) (v18 or newer) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Akm592/upliance_ai_form.git
    cd upliance_ai_form
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

### Running the Application

To start the development server, run the following command. The application will be available at `http://localhost:5173` by default.

```sh
npm run dev
```

---

## How It Works

The application is divided into three main routes:

-   **/myforms**: The main dashboard where you can see all your created forms. From here, you can choose to preview, edit, or delete any form.
-   **/create** or **/edit/:formId**: The Form Builder interface.
    -   Use the toolbar on the left to add new fields to the form canvas.
    -   Click on a field to open the **Field Configuration** panel on the right.
    -   Drag and drop fields to reorder them.
    -   Click "Save Form" to name your configuration and persist it.
-   **/preview/:formId**: The Form Preview page.
    -   Interact with the form exactly as an end-user would.
    -   Input is validated in real-time based on your configured rules.
    -   Derived fields will automatically update when their parent fields change.