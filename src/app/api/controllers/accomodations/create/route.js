// src/app/api/accommodations/create/route.js
import { NextResponse } from "next/server";
import Accommodation from "../../../models/Accommodation";

export async function POST(request) {
  const {
    roomNumber,
    address,
    roomType,
    occupantType,
    numberOfOccupants,
    costPerBed,
    occupantIds,
  } = await request.json();

  if (
    !roomNumber ||
    !address ||
    !roomType ||
    !occupantType ||
    !numberOfOccupants ||
    !costPerBed
  ) {
    return new NextResponse(
      JSON.stringify({ message: "All fields are required" }),
      { status: 400 }
    );
  }

  const accommodation = new Accommodation({
    roomNumber,
    address,
    roomType,
    occupantType,
    numberOfOccupants,
    costPerBed,
    occupants: occupantIds,
  });

  await accommodation.save();

  return new NextResponse(
    JSON.stringify({
      message: `New accommodation ${roomNumber} created`,
      accommodation,
    }),
    { status: 201 }
  );
}
