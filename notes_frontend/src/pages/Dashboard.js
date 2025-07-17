import React, { useState, useEffect } from "react";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
  getNote,
} from "../api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../AuthContext";

// PUBLIC_INTERFACE
export default function Dashboard() {
  const { token, logout } = useAuth();

  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [editor, setEditor] = useState({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);

  async function refreshNotes(s = "") {
    setLoading(true);
    try {
      const notesFetched = await fetchNotes(token, s);
      setNotes(notesFetched);
      // Mock categories: all, or parse from notes
      const cats = [
        ...new Set(
          notesFetched.map((n) => {
            const first = n.title.split(":")[0];
            if (first && first.length < 32) return first;
            return null;
          })
        ),
      ].filter((n) => !!n && n !== "all");
      setCategories(cats);
    } catch (e) {
      // On error, logout (token expired)
      logout();
    }
    setLoading(false);
  }

  useEffect(() => {
    refreshNotes(search);
    // eslint-disable-next-line
  }, [search, token]);

  function selectNote(n) {
    setActiveNote(n);
    setEditor({ title: n.title, content: n.content || "" });
    setIsEditing(false);
  }

  function handleCategory(cat) {
    setCategory(cat);
    if (cat === "all") {
      setSearch("");
    } else {
      setSearch(cat + ":");
    }
  }

  function handleNewNote() {
    setActiveNote(null);
    setEditor({ title: "", content: "" });
    setIsEditing(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!editor.title.trim()) return;
    if (activeNote) {
      // Update
      const updated = await updateNote(token, activeNote.id, editor);
      await refreshNotes(search);
      setActiveNote(updated);
    } else {
      // Create
      const newCreated = await createNote(token, editor);
      await refreshNotes(search);
      setActiveNote(newCreated);
    }
    setIsEditing(false);
  }

  async function handleEdit() {
    setIsEditing(true);
  }

  async function handleDelete() {
    if (!window.confirm("Delete this note?")) return;
    await deleteNote(token, activeNote.id);
    await refreshNotes(search);
    setActiveNote(null);
    setEditor({ title: "", content: "" });
    setIsEditing(false);
  }

  // Filter notes by category
  const visibleNotes =
    category === "all"
      ? notes
      : notes.filter((n) => n.title.startsWith(category + ":"));

  return (
    <div className="main-layout">
      <Navbar onLogout={logout} />
      <Sidebar
        categories={categories}
        selected={category}
        onSelect={handleCategory}
      />
      <main className="main-area">
        <div className="notes-list-section">
          <div className="notes-header">
            <input
              type="search"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
            />
            <button className="btn" onClick={handleNewNote}>
              + New Note
            </button>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ul className="notes-list">
              {visibleNotes.map((note) => (
                <li
                  key={note.id}
                  className={`note-item${
                    activeNote && note.id === activeNote.id ? " active" : ""
                  }`}
                  onClick={() => selectNote(note)}
                >
                  <div className="note-title">{note.title}</div>
                  <div className="note-date">
                    {new Date(note.updated_at).toLocaleString()}
                  </div>
                </li>
              ))}
              {!visibleNotes.length && <li>No notes found.</li>}
            </ul>
          )}
        </div>
        <div className="note-detail-section">
          {activeNote || isEditing ? (
            <form className="note-editor" onSubmit={handleSave}>
              <input
                type="text"
                className="note-title-input"
                value={editor.title}
                onChange={(e) =>
                  setEditor((ed) => ({ ...ed, title: e.target.value }))
                }
                placeholder="Title"
                required
                disabled={!isEditing && !!activeNote}
              />
              <textarea
                className="note-content-input"
                rows={12}
                value={editor.content}
                onChange={(e) =>
                  setEditor((ed) => ({ ...ed, content: e.target.value }))
                }
                placeholder="Write your note..."
                required
                disabled={!isEditing && !!activeNote}
              />
              <div className="note-actions">
                {isEditing ? (
                  <button className="btn btn-large" type="submit">
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      className="btn"
                      type="button"
                      onClick={handleEdit}
                      disabled={!activeNote}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={handleDelete}
                      disabled={!activeNote}
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => {
                    setActiveNote(null);
                    setEditor({ title: "", content: "" });
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="empty-detail">Select or create a note.</div>
          )}
        </div>
      </main>
    </div>
  );
}
