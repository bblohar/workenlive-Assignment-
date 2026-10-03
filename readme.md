# Comprehensive Student Management System

A full-stack React and Node.js application built for the Workenlive Entry-Level Product Developer assignment.

## Features
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Context API
- **Backend:** Node.js, Express, MySQL
- **Functionality:** Full CRUD, dynamic search, multi-parameter filtering, sorting, pagination, and strict form validation.
- **Resilience:** Dual-sync state management. Runs with the MySQL backend, but safely falls back to `localStorage` if the backend is offline.

## How to Run the Application

### 1. Start the Backend (Optional but Recommended)
Ensure you have MySQL running locally.
1. Open terminal and navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Update `server.js` with your local MySQL password.
4. Run the server: `npm run start` or `node server.js`

### 2. Start the Frontend
1. Open a new terminal and navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. Open the provided localhost link in your browser.