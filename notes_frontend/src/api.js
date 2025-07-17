//
// API utility functions for communicating with the backend FastAPI notes API.
//
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

function getAuthHeaders(token) {
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };
}

// PUBLIC_INTERFACE
export async function signup(email, password) {
  const resp = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!resp.ok) {
    throw await resp.json();
  }
  return resp.json();
}

// PUBLIC_INTERFACE
export async function login(username, password) {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);
  const resp = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!resp.ok) {
    throw await resp.json();
  }
  return resp.json();
}

// PUBLIC_INTERFACE
export async function fetchNotes(token, search = "") {
  const url =
    search && search.trim()
      ? `${API_BASE}/notes/?search=${encodeURIComponent(search)}`
      : `${API_BASE}/notes/`;
  const resp = await fetch(url, { headers: getAuthHeaders(token) });
  if (!resp.ok) throw await resp.json();
  return resp.json();
}

// PUBLIC_INTERFACE
export async function getNote(token, noteId) {
  const resp = await fetch(`${API_BASE}/notes/${noteId}`, {
    headers: getAuthHeaders(token),
  });
  if (!resp.ok) throw await resp.json();
  return resp.json();
}

// PUBLIC_INTERFACE
export async function createNote(token, note) {
  const resp = await fetch(`${API_BASE}/notes/`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(note),
  });
  if (!resp.ok) throw await resp.json();
  return resp.json();
}

// PUBLIC_INTERFACE
export async function updateNote(token, noteId, note) {
  const resp = await fetch(`${API_BASE}/notes/${noteId}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(note),
  });
  if (!resp.ok) throw await resp.json();
  return resp.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(token, noteId) {
  const resp = await fetch(`${API_BASE}/notes/${noteId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  if (!resp.ok) throw await resp.json();
  return null;
}
