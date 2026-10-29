import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Teacher } from "@/models/Teacher";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { role, identifier, password } = body;

    // Handle Admin login
    if (role === "ADMIN") {
      if (password && password !== "admin123") {
        return NextResponse.json(
          { success: false, error: "Invalid admin password (default: admin123)" },
          { status: 401 }
        );
      }

      const adminUser = {
        id: "admin-01",
        fullName: "School Principal / Administrator",
        email: "principal@school.edu.np",
        role: "ADMIN",
        title: "Principal & Admin",
      };

      const response = NextResponse.json({
        success: true,
        message: "Logged in as Administrator",
        user: adminUser,
      });

      response.cookies.set("lms_user", JSON.stringify(adminUser), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // Handle Teacher login
    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "Please enter your Employee ID or Email" },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim();
    // Search by employeeId or email (case insensitive)
    const teacher = await Teacher.findOne({
      $or: [
        { employeeId: { $regex: new RegExp(`^${cleanIdentifier}$`, "i") } },
        { email: cleanIdentifier.toLowerCase() },
      ],
    });

    if (!teacher) {
      return NextResponse.json(
        {
          success: false,
          error: `No teacher found with ID or Email '${cleanIdentifier}'. Try TCH-101, TCH-102, or ramesh.bhattarai@school.edu.np`,
        },
        { status: 404 }
      );
    }

    // Verify password (default teacher123)
    const expectedPassword = teacher.password || "teacher123";
    if (password && password !== expectedPassword && password !== "teacher123") {
      return NextResponse.json(
        { success: false, error: "Incorrect password. (Default is teacher123)" },
        { status: 401 }
      );
    }

    const teacherUser = {
      id: teacher._id.toString(),
      fullName: teacher.fullName,
      email: teacher.email,
      phone: teacher.phone,
      employeeId: teacher.employeeId,
      role: "TEACHER",
      subjects: teacher.subjects || [],
      isClassTeacher: Boolean(teacher.isClassTeacher),
      assignedClass: teacher.assignedClass || "",
      assignedSection: teacher.assignedSection || "",
      qualification: teacher.qualification,
    };

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${teacher.fullName}!`,
      user: teacherUser,
    });

    response.cookies.set("lms_user", JSON.stringify(teacherUser), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}

