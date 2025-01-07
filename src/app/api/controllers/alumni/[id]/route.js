// app/api/alumni/[id]/route.js
import { NextResponse } from "next/server";
import Student from "../../../../models/Student";
import Accommodation from "../../../../models/Accommodation";

export async function GET(req) {
  const { id } = req.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { message: "Alumni ID is required" },
      { status: 400 }
    );
  }

  try {
    let alumni = await Student.findById(id).lean();

    if (!alumni) {
      return NextResponse.json(
        { message: "Alumni not found" },
        { status: 404 }
      );
    }

    const populations = [
      { path: "campus" },
      { path: "intakeGroup" },
      { path: "assignments" },
      { path: "qualification" },
      {
        path: "guardians",
        model: "Guardian",
        select: "firstName lastName email mobileNumber relation -_id",
      },
    ];

    for (let populate of populations) {
      try {
        alumni = await Student.populate(alumni, populate);
      } catch (popError) {
        console.error(
          `Failed to populate ${populate.path}: ${popError.message}`
        );
        continue;
      }
    }

    // Use local proxy URL for the avatar if it exists
    if (alumni.profile && alumni.profile.avatar) {
      const avatarKey = alumni.profile.avatar.split(".com/")[1];
      alumni.profile.avatar = `https://limpopochefs.vercel.app/api/files/getFile?key=${avatarKey}`;
    }

    // Find accommodations where the alumni is an occupant
    const accommodations = await Accommodation.find({ occupants: id }).lean();
    alumni.accommodations = accommodations;

    // Include current accommodation details
    if (alumni.accommodations.length > 0) {
      alumni.currentAccommodation = alumni.accommodations[0];
    } else {
      alumni.currentAccommodation = null;
    }

    return NextResponse.json(alumni);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to retrieve alumni" },
      { status: 500 }
    );
  }
}
