import db from "../../../lib/db";

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const authorId = typeof body.authorId === "number" ? body.authorId : null;

    if (!category || !title || !content || !authorId) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if(title.length < 5) {
        return Response.json({ error: "Title must be at least 5 characters long" }, { status: 400 });
    }
    
    if(content.length < 20) {
        return Response.json({ error: "Content must be at least 20 characters long" }, { status: 400 });
    }

    if(content.length > 50) {
        return Response.json({ error: "Content must be less than 50 characters long" }, { status: 400 });
    }

    try {
        const stmt = db.prepare(
            "INSERT INTO posts (title, category, content, author_id) VALUES (?, ?, ?, ?)"
        );
        const result = stmt.run(title, category, content, authorId);
        return Response.json({ id: result.lastInsertRowid, title, category }, { status: 201 });
    } catch (error) {
        return Response.json({ error: "Failed to create post" }, { status: 500 });
    }
}

export async function GET() {
    return new Response("This endpoint is for creating posts. Please use POST method.", { status: 405 });
}