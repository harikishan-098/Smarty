const API_BASE = "https://ai-learning-4ttb.onrender.com";

export async function sendChat(messages) {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    let message = `Server error: ${response.status}`;
    try {
      const errorBody = await response.json();
      message = errorBody.message || errorBody.error || message;
    } catch {
      // Keep the status-based fallback.
    }
    throw new Error(message);
  }

  return await response.json();
}
