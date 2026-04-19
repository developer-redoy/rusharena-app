import { connectDB } from "@/lib/connectDB";
import ResultMatches from "@/models/resultMatch";

export async function GET(request) {
  try {
    await connectDB();

    // 👇 userId from headers
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized Access!" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔥 MongoDB filtering (FAST & SCALABLE)
    const matches = await ResultMatches.find().lean();

    if (!matches.length) {
      return new Response(
        JSON.stringify({ message: "No joined matches found", data: [] }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ message: "Success", data: matches }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error);

    return new Response(
      JSON.stringify({
        message: "Failed to fetch matches",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
