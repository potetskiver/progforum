"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DeletePostProps {
    postId: number;
    all?: boolean;
}

export default function DeletePost({ postId, all }: DeletePostProps) {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/user')
            .then(res => res.json())
            .then(user => {
                setIsAdmin(user?.admin || false);
                setLoading(false);
            })
            .catch(() => {
                setIsAdmin(false);
                setLoading(false);
            });
    }, []);

    function handleDelete() {
        fetch("/api/posts/deletePost", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ postId, all })
        }).then(() => {
            router.push("/");
            window.location.reload();
        });
    }

    if (loading) return null;

    if (!isAdmin) return null;

    return (
        <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 mt-2 rounded"
        >
            Delete Post
        </button>
    );
}