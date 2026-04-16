"use client"

import { useEffect, useState } from "react";
import DeletePost from "./DeletePost";

interface PostData {
    id: number;
    title: string;
    category: string;
    content: string;
    username: string;
    created_at: string;
}

export default function Posts({ className }: { className?: string }){
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = () => {
            fetch('/api/posts')
                .then(res => res.json())
                .then(data => {
                    setPosts(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        };

        fetchPosts(); // Initial fetch
        const interval = setInterval(fetchPosts, 5000); // Fetch every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    if (loading) return <div>Loading posts...</div>;

    return(
        <main className="w-full mt-5">
            <div className={className}>
                {posts.length === 0 ? (
                    <p className="text-black">No posts yet</p>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="mb-4 p-4 border border-black rounded">
                            <h2 className="text-xl font-bold text-black">{post.title}</h2>
                            <p className="text-sm text-black">
                                By <span className="font-semibold text-black">{post.username}</span> • {post.category}
                            </p>
                            <p className="mt-2 text-black">{post.content}</p>
                            <p className="text-xs text-black mt-2">{new Date(post.created_at).toLocaleString()}</p>
                            <DeletePost postId={post.id}/>
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}