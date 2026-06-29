import { connectDB } from "@/lib/connectDB";
import { response } from "@/lib/healperFunc";
import Refund from "@/models/refund";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const authId = searchParams.get("authId");

    if (!authId) {
      return response(false, 400, "authId is required");
    }

    // Get all refunds of the user
    const userRefunds = await Refund.find({ userId: authId })
      .populate("userId")
      .sort({ createdAt: -1 })
      .lean();

    // No refunds found
    if (!userRefunds.length) {
      return response(true, 200, "No refunds found", {
        userName: "",
        totalRefunds: 0,
        totalRefundAmount: 0,
        matches: [],
      });
    }

    // User info
    const userInfo = userRefunds[0].userId || {};

    // Calculate totals
    const totalRefunds = userRefunds.length;

    const totalRefundAmount = userRefunds.reduce(
      (sum, item) => sum + Number(item.refund || 0),
      0,
    );

    // Response data
    const data = {
      userName: userInfo.name || "Unknown User",
      totalRefunds,
      totalRefundAmount,
      matches: userRefunds.map(({ userId, ...rest }) => rest),
    };

    return response(
      true,
      200,
      "User refund details fetched successfully",
      data,
    );
  } catch (error) {
    console.error("Error fetching refunds:", error);
    return response(false, 500, "Server error", error.message);
  }
}
