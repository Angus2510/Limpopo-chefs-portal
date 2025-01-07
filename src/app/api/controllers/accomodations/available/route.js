// src/app/api/accommodations/route.js
import Accommodation from "@/models/Accommodation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accommodations = await Accommodation.find()
      .populate({
        path: "occupants",
        select: "profile.firstName profile.lastName",
      })
      .lean();

    if (!accommodations.length) {
      return new NextResponse(
        JSON.stringify({ message: "No accommodations found" }),
        { status: 400 }
      );
    }

    // Modify accommodation objects to include availability status
    const accommodationsWithAvailability = accommodations.map(
      (accommodation) => {
        const occupantsCount = accommodation.occupants
          ? accommodation.occupants.length
          : 0;
        const isAvailable = occupantsCount < accommodation.numberOfOccupants;
        return {
          ...accommodation,
          isAvailable,
        };
      }
    );

    return new NextResponse(JSON.stringify(accommodationsWithAvailability), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
