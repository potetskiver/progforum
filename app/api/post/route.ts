export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const authorId = typeof body.authorId === "number" ? body.authorId : null;

    if (!category || !title || !content || !authorId) {
        return new Response("Missing required fields", { status: 400 });
    }

    return new Response(`Post created with title: ${title} and Category: ${category} by Author ID: ${authorId}`, { status: 201 });
}

export async function GET() {
    return new Response("This endpoint is for creating posts. Please use POST method.", { status: 405 });
}