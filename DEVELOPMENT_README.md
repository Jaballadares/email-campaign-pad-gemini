
# Marketer Pad: Development Status & Roadmap

This document outlines the project's vision, current status, and future plans. It's a living document designed to help the team quickly get up to speed for any development session.

---

## 1. Project Vision (The "Why")

The core mission is to streamline the email production workflow for marketers. We are building a lightweight, document-style editor that allows writers to draft email copy and, with a single click, publish it directly to Braze templates. This eliminates the error-prone, manual process of copying and pasting content between Google Docs and Braze, saving time and reducing errors.

The full project vision can be found in `Project-Vision.md`.

---

## 2. Our Approach (The "How")

We are building a **Phase 1 Proof of Concept** as defined in the project vision.

*   **Stack**: We are using a modern, cohesive stack built on **Next.js** with TypeScript. This allows us to have both the frontend (React) and the backend (API Routes) in a single, unified codebase.
*   **Editor**: The rich-text editor is built with **Slate.js**, a powerful and extensible framework for building editors.
*   **Styling**: We are using **Tailwind CSS** for styling.
*   **Package Manager**: We are using **pnpm** for package management.

---

## 3. What's Been Done (The "What")

We have successfully completed the initial setup and implemented the core one-way push functionality.

*   **Project Initialization**: The Next.js project has been created and configured with TypeScript, ESLint, and Tailwind CSS.
*   **Basic Editor**: A basic Slate.js editor has been created with support for **bold** and *italic* formatting.
*   **Braze API Integration**: 
    *   A backend API route (`/api/braze/templates`) has been created to handle requests to the Braze API.
    *   The editor's content is converted from Slate.js's JSON format to HTML using the `@slate-serializers/html` library.
    *   The backend makes a `PUT` request to the Braze `/email/templates/{template_id}` endpoint to update the `html_body` of an email template.
*   **Configuration**: The Braze API key and Template ID are configured using a `.env.local` file.

---

## 4. What's Next (The "Roadmap")

The following are the next logical steps to move the project forward:

1.  **Enhance the Editor**: 
    *   Add support for more rich-text elements like headings, lists, and links.
    *   Implement slash commands for inserting Liquid snippets (e.g., `{{custom_attribute.first_name}}`).
2.  **Implement the Side Panel**: Create the side panel UI for managing email metadata like subject line, preview text, and UTM parameters.
3.  **Liquid Validation**: Add a step to validate the Liquid syntax before pushing to Braze. The `liquidjs` npm package is a good candidate for this.
4.  **Improve User Feedback**: Provide feedback to the user on the frontend after a successful or failed publish operation.

---

## 5. Shortcuts & Considerations

To accelerate the development of this proof of concept, we have taken some shortcuts. These should be addressed before moving to a production environment.

*   **Hardcoded Template ID**: The `BRAZE_TEMPLATE_ID` is currently hardcoded in the `.env.local` file. In the future, the user should be able to select the template they want to edit.
*   **Security**: The Braze API key is stored in a `.env.local` file. For a production application, this should be stored more securely (e.g., using a service like HashiCorp Vault or AWS Secrets Manager).
*   **Error Handling**: The frontend currently has no error handling. If the Braze API call fails, the user will not be notified.
*   **No Pull-Back Sync**: This is a one-way push only. The project vision includes a two-way sync to pull content from Braze, which has not been implemented yet.
