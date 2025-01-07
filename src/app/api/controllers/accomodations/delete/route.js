// src/app/api/accommodations/delete/route.js
import { NextResponse } from "next/server";
import Accommodation from "../../../models/Accommodation";

export async function DELETE({ params }) {
  const { id } = params;

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: "Accommodation ID is required" }),
      { status: 400 }
    );
  }

  const accommodation = await Accommodation.findById(id).exec();

  if (!accommodation) {
    return new NextResponse(
      JSON.stringify({ message: "Accommodation not found" }),
      { status: 404 }
    );
  }

  await accommodation.deleteOne();

  return new NextResponse(
    JSON.stringify({
      message: `Accommodation ${accommodation.roomNumber} deleted successfully`,
    }),
    { status: 200 }
  );
}
