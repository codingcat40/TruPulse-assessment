import React, { useEffect, useState, useRef } from "react";
import { addNote, getAllNotes, deleteNote, updateNote } from "/api";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const debounceRef = useRef(null);

  const loadNotes = async () => {
    const allNotes = await getAllNotes();
    const sortedNotes = allNotes.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    setNotes(sortedNotes);
  };

  useEffect(() => {
    loadNotes();
    window.addEventListener("online", () => {
      setIsOnline(true);
      loadNotes();
    });
    window.addEventListener("offline", () => setIsOnline(false));
    return () => {
      window.removeEventListener("online", loadNotes);
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  const handleAdd = async () => {
    const newNote = {
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      title,
      content,
      synced: false,
    };
    await addNote(newNote);
    setTitle("");
    setContent("");
    loadNotes();
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    loadNotes();
  };

  useEffect(() => {
    if (!editNote) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      await updateNote(editNote);
      loadNotes();
    }, 5000);

    return () => clearTimeout(debounceRef.current);
  }, [editNote]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 font-sans">Take Notes here</h1>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isOnline 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {isOnline ? "Online" : "Offline"}
          </div>
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Add Note</h3>
        <div className="space-y-8">
          <div>
            <label
              htmlFor="title"
              className=" text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              id="content"
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <button
            onClick={handleAdd}
            className=" flex justify-center py-3 px-4 border-0 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"
          >
            Add Note
          </button>
        </div>
      </div>

      

      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {note.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{note.content}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditNote(note)}
                  className="items-center px-3 py-1 border-0 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="items-center px-3 py-1 border-0 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editNote && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Autosaving Note....
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Update Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={editNote.title}
                  onChange={(e) =>
                    setEditNote({ ...editNote, title: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="edit-content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Update Content
                </label>
                <input
                  id="edit-content"
                  type="text"
                  value={editNote.content}
                  onChange={(e) =>
                    setEditNote({ ...editNote, content: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditNote(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
