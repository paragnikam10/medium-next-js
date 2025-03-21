import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password, email, oauthProvider } = body;

    if (oauthProvider) {
      const token = await getToken({ req });
      if (!token || !token.email) {
        return NextResponse.json(
          {
            message: "Invalid oauth session",
          },
          {
            status: 400,
          }
        );
      }
      let user = await prisma.user.findUnique({
        where: { email: token.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: token.email,
            name: token.name ?? "",
            image: token.picture ?? "",
          },
        });
      }

      if (!user) {
        return NextResponse.json(
          {
            message: "User not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Signed in successfully (OAuth)",
        user: { id: user.id, email: user.email, name: user.name },
      });
    }

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Username and password required",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    console.log("signin user details", user);
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          message: "Invalid password",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
      message: "Signed up successfully ",
      user: { id: user.id, email: user.email, name: user.name },
    },
    {status : 201}
  );
  } catch (error) {
    console.error("Error signing in ", error);
    return NextResponse.json(
      {
        error: "Error signing in",
      },
      { status: 500 }
    );
  }
}
