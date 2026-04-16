"use client"

import { useState } from 'react';
import NewPost from "./NewPost";

export default function PostButton({ className }: { className?: string }) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <div className={className}>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded zb-5"
        >
          New post
        </button>
      </div>
      {showPanel && <NewPost />}
    </>
  );
}