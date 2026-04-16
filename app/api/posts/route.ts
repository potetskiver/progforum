import db from "../../lib/db";

export async function GET() {
    try {
        const posts = db.prepare(
            "SELECT posts.id, posts.title, posts.category, posts.content, posts.created_at, users.username FROM posts JOIN users ON posts.author_id = users.id ORDER BY posts.created_at DESC"
        ).all();
        return Response.json(posts, { status: 200 });
    } catch (error) {
        return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}
