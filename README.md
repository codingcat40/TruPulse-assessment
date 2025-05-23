# Offline-First Notes App

A simple notes application that works both online and offline, built with React and IndexedDB, JSON-SERVER for backend.

## Features

-  Create, edit, and delete notes
-  Search notes by title or content
-  Works offline with local storage
- Clean and responsive design

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the JSON Server** (for backend)
   ```bash
   npx json-server --watch db.json --port 3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:5173` to see the app

## How to Use

1. **Add Notes**
   - Fill in the title and content
   - Click "Add Note" button
   - Your note will be saved locally and synced when online

2. **Edit Notes**
   - Click the "Edit" button on any note
   - Make your changes
   - Changes are auto-saved after 5 seconds(5000 milliseconds)

3. **Delete Notes**
   - Click the "Delete" button on any note
   - The note will be removed immediately

4. **Searching Notes**
   - Use the search bar at the top
   - Search works on both title and content

## Design Decisions

   - Used IndexedDB for local storage
   - Notes are saved locally first
   - Syncs with server when online
   - Ensures app works without internet
   - Simple, clean user interface
   - Autosave for edits after 5 seconds
   - Responsive design for all devices
   - Debounced edit saving (5-second delay)


## Testing the App

1. **Online Testing**
   - Start both servers (JSON Server and React app)
   - Create, edit, and delete notes
   - Verify changes persist after refresh
   - data sustains across various browsers

2. **Offline Testing**
   - Turn off your internet connection
   - shows the online/offline status

3. **Search Testing**
   - Create multiple notes
   - searching by title and content both

## Browser Support

- Any Browser(prefer chrome)


## Dependencies

- React
- Vite
- Tailwind CSS
- IndexedDB (idb)
- JSON Server


