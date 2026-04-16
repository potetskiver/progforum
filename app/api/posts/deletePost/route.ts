import db from "../../../lib/db";
import { getUser } from "../../../lib/user-server";

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const postId = body.postId;
    const all = body.all;

    const user = await getUser();
    if (!user || !user.admin) {
        return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (all) {
        try {
            const stmt = db.prepare("DELETE FROM posts");
            const result = stmt.run();
            return Response.json({ message: "All posts deleted", changes: result.changes }, { status: 200 });
        } catch (error) {
            return Response.json({ error: "Failed to delete all posts" }, { status: 500 });
        }
    }

    if (!postId) {
        return Response.json({ error: "Post ID required" }, { status: 400 });
    }

    try {
        const stmt = db.prepare("DELETE FROM posts WHERE id = ?");
        const result = stmt.run(postId);

        if (result.changes === 0) {
            return Response.json({ error: "Post not found" }, { status: 404 });
        }

        return Response.json({ message: "Post deleted" }, { status: 200 });
    } catch (error) {
        return Response.json({ error: "Failed to delete post" }, { status: 500 });
    }
}