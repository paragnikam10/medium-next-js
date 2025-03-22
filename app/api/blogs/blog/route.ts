import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {

  try {
    const session = await getServerSession();
    console.log("blog api", session?.user);
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    console.log("session", session.user.email);
    const blogs = await prisma.blog.findMany({
      where: {
        author: {
          email : {
            not : session.user.email
          }
        },
      },
      include: {
        author: true,
      },
    });
    console.log("blogs ", blogs.length);
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs", error);
    return NextResponse.json(
      {
        error: "Error fetching blogs",
      },
      { status: 500 }
    );
  }
}
