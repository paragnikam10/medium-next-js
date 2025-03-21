import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

export async function POST(req: NextRequest) {
  console.log("signup backend route")
  try {
    const body = await req.json();

    const result = signUpSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => err.message);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: errors,
        },
        { status: 400 }
      );
    }

    const defaultImageUrl =
      "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg";
    const existingUser = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Username already taken",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        password: hashedPassword,
        profileImage: defaultImageUrl,
      },
    });
    //console.log("signup api route", newUser);

    return NextResponse.json({
      message: "You are signed up successfully",
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    console.error("Erroe signing new user", error);
    return NextResponse.json(
      {
        error: "Error signing new user",
      },
      {
        status: 500,
      }
    );
  }
}
