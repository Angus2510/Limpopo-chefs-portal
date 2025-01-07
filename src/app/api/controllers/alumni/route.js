// app/api/alumni/route.js
import { NextResponse } from "next/server";
import Student from "../../../models/Student";
import Accommodation from "../../../models/Accommodation";

export async function GET() {
  try {
    // Get all alumni from MongoDB where alumni is true
    const alumni = await Student.find({ alumni: true })
      .select("-password")
      .populate("intakeGroup")
      .populate("campus")
      .lean();

    if (!alumni.length) {
      return NextResponse.json({ message: "No alumni found" }, { status: 400 });
    }

    return NextResponse.json(alumni);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to retrieve alumni" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const { id } = req.nextUrl.searchParams;

  if (!id) {
    return NextResponse.json(
      { message: "Student ID is required" },
      { status: 400 }
    );
  }

  try {
    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Toggle alumni status
    student.alumni = !student.alumni;
    await student.save();

    return NextResponse.json({
      message: `Alumni status toggled for student ${id}`,
      alumni: student.alumni,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to toggle alumni status" },
      { status: 500 }
    );
  }
}
