// src/app/api/accommodations/route.js
import { NextResponse } from "next/server";
import Accommodation from "../../../models/Accommodation";

export async function GET() {
  const accommodations = await Accommodation.find()
    .populate({
      path: "occupants",
      select: "profile.firstName profile.lastName",
    })
    .lean();

  if (!accommodations?.length) {
    return new NextResponse(
      JSON.stringify({ message: "No accommodations found" }),
      { status: 400 }
    );
  }

  const accommodationsWithAvailability = accommodations.map((accommodation) => {
    const occupantsCount = accommodation.occupants
      ? accommodation.occupants.length
      : 0;
    const isAvailable = occupantsCount < accommodation.numberOfOccupants;
    return {
      ...accommodation,
      isAvailable,
    };
  });

  return new NextResponse(JSON.stringify(accommodationsWithAvailability), {
    status: 200,
  });
}
