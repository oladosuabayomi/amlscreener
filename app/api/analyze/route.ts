import { NextRequest } from "next/server";

// Proxy the analyze request to the FastAPI backend
export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const upstream = await fetch(`${backendUrl}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // Stream the response back as-is
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
