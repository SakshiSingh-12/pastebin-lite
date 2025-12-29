"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setUrl("");

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined,
      }),
    });

    if (!res.ok) {
      setError("Failed to create paste");
      return;
    }

    const data = await res.json();
    setUrl(data.url);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Pastebin Lite
        </h1>

        <label className="block mb-2 font-medium">
          Paste Content
        </label>
        <textarea
          className="w-full border rounded-md p-2 mb-4"
          rows={8}
          placeholder="Write your text here..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <div className="flex gap-4 mb-4">
          <input
            className="flex-1 border rounded-md p-2"
            placeholder="TTL seconds (optional)"
            onChange={e => setTtl(e.target.value)}
          />
          <input
            className="flex-1 border rounded-md p-2"
            placeholder="Max views (optional)"
            onChange={e => setViews(e.target.value)}
          />
        </div>

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Create Paste
        </button>

        {error && (
          <p className="text-red-600 mt-4 text-center">{error}</p>
        )}

        {url && (
          <div className="mt-4 text-center">
            <p className="font-medium">Shareable URL:</p>
            <a
              href={url}
              className="text-blue-600 underline break-all"
            >
              {url}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
