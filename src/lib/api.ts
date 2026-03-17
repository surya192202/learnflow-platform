export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function getToken(): string | null {
  return localStorage.getItem("token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export async function fetchSubjectTree(subjectSlug: string) {
  // First find the subject ID from slug via the subjects list
  const res = await fetch(`${API_BASE}/subjects`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch subjects");
  const subjects = await res.json();
  const subject = subjects.find((s: any) => s.slug === subjectSlug);
  if (!subject) throw new Error("Subject not found");

  const treeRes = await fetch(`${API_BASE}/subjects/${subject.id}/tree`, {
    headers: authHeaders(),
  });
  if (!treeRes.ok) throw new Error("Failed to fetch subject tree");
  return treeRes.json();
}

export async function markVideoComplete(videoId: number) {
  const res = await fetch(`${API_BASE}/progress/videos/${videoId}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ is_completed: true, last_position_seconds: 99999 }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || "Failed to update progress");
  }
  return res.json();
}

export async function fetchSubjectsList() {
  const res = await fetch(`${API_BASE}/subjects`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch subjects");
  return res.json();
}
