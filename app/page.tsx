import PostButton from "./components/PostButton";

// app/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <h1 className="text-4xl font-bold">Welcome to ProgForum!</h1>

      <div className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-black dark:bg-gray-100 rounded-lg shadow-md mt-6 w-full h-auto max-w-4xl">
        <PostButton className="absolute top-4 right-4" />
      </div>

      <p className="mt-4 text-lg text-gray-600">Your go-to place for programming discussions and resources.</p>
    </main>
  );
}