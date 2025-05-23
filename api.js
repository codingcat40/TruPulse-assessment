import { openDB } from "idb";

const BASE_URL = "http://localhost:3000/notes";
const DB_NAME = "notesDB";
const STORE_NAME = "notes";


const isOnline = function () {
  return window.navigator.onLine;
};

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  },
});

const saveToIDB = async (note) => {
  const db = await dbPromise;
  await db.put(STORE_NAME, note);
};

const deleteFromIDB = async (id) => {
  const db = await dbPromise;
  await db.delete(STORE_NAME, id);
};

const getNotesFromIDB = async () => {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
};

// JSON-SERVER CRUD methods

export const addNote = async (note) => {
  if (isOnline()) {
    window.dispatchEvent(new CustomEvent('syncStatus', { detail: { syncing: true } }));
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      const savedNote = await res.json();
      await saveToIDB(savedNote);
      window.dispatchEvent(new CustomEvent('syncStatus', { detail: { syncing: false } }));
      return savedNote;
    } catch (error) {
      window.dispatchEvent(new CustomEvent('syncStatus', { detail: { syncing: false } }));
      throw error;
    }
  } else {
    await saveToIDB(note);
    return note;
  }
};

export const getAllNotes = async () => {
  if (isOnline()) {
    window.dispatchEvent(new CustomEvent('syncStatus', { detail: { syncing: true } }));
    try {
      const res = await fetch(BASE_URL);
      const notes = await res.json();
      const db = await dbPromise;
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      await store.clear();

      for (const note of notes) {
        await store.put(note);
      }
      await tx.done;
      window.dispatchEvent(new CustomEvent('syncStatus', { detail: { syncing: false } }));
      return notes;
    } catch (error) {
      window.dispatchEvent(new CustomEvent('syncStatus', { detail: { syncing: false } }));
      throw error;
    }
  } else {
    return await getNotesFromIDB();
  }
};

export const updateNote = async (note) => {
  if (isOnline()) {
    window.dispatchEvent(new CustomEvent('syncStatus', { detail: { syncing: true } }));
    try {
      const res = await fetch(`${BASE_URL}/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      const updatedNote = await res.json();
      await saveToIDB(updatedNote);
      window.dispatchEvent(new CustomEvent('syncStatus', { detail: { syncing: false } }));
      return updatedNote;
    } catch (error) {
      window.dispatchEvent(new CustomEvent('syncStatus', { detail: { syncing: false } }));
      throw error;
    }
  } else {
    await saveToIDB(note);
    return note;
  }
};

export const deleteNote = async (id) => {
  if (isOnline()) {
    window.dispatchEvent(new CustomEvent('syncStatus', { detail: { syncing: true } }));
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });
      await deleteFromIDB(id);
      window.dispatchEvent(new CustomEvent('syncStatus', { detail: { syncing: false } }));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('syncStatus', { detail: { syncing: false } }));
      throw error;
    }
  } else {
    await deleteFromIDB(id);
  }
};
