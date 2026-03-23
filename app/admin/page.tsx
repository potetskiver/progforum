import { getUser } from "../lib/user";

export default async function AdminPage() {
    const user = await getUser();

    if (!user || !user.admin) {
        return <main className="flex min-h-screen flex-col items-center justify-between p-8">Access denied.</main>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="mt-4 text-lg text-gray-600">Welcome to the admin dashboard. Here you can manage users, posts, and site settings.</p>
        </main>
    );
}