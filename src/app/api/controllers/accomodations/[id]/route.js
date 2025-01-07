import Accommodation from "@/db/models/Accommodation";
import dbConnect from "@/db/connect";

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const accommodation = await Accommodation.findById(id)
      .populate({
        path: "occupants",
        select: "profile.firstName profile.lastName",
      })
      .lean();

    if (!accommodation) {
      return new Response(
        JSON.stringify({ message: "Accommodation not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(accommodation), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
