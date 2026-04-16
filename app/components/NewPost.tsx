"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewPost(){
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [authorId, setAuthorId] = useState<number | null>(null);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/user')
            .then(res => res.json())
            .then(user => setAuthorId(user?.id || 1))
            .catch(() => setAuthorId(999));
    }, []);

    async function handlePost(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const res = await fetch("/api/posts/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, category, content, authorId }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error ?? "Post failed");
            return;
        }

        router.push("/");
        window.location.reload();
    }

    return (
    <main className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md p-8 border rounded shadow bg-black">
        <h1 className="text-3xl font-bold mb-6">New post</h1>

        <form onSubmit={handlePost} className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            type="Category"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <textarea
            className="w-full h-30 border p-2 rounded align-text-top"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {error && <p className="text-red-600">{error}</p>}

          <button onClick={handlePost} className="w-full bg-gray-800 text-white p-2 rounded hover:bg-black">
            Post
          </button>
        </form>
      </div>
    </main>
  );
}