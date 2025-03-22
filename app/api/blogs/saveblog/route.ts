import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, userId } = body;

    if (!title || !content || !userId) {
      console.error("All fields are required", { title, content, userId });
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Ensure userId is a string
    if (typeof userId !== "string") {
      console.error("Invalid userId:", userId);
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const author = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!author || !author.name) {
      console.error("Author not found for userId:", userId);
      return NextResponse.json(
        { message: "Author not found or name is missing" },
        { status: 404 }
      );
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        authorId: userId,
        authorName: author.name,
      },
    });

    console.log("Blog saved successfully:", blog);
    return NextResponse.json(
      { message: "Blog saved successfully", blog },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error saving blog:", error);
    return NextResponse.json(
      { message: "Error saving blog", error },
      { status: 500 }
    );
  }
}
