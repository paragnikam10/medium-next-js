import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, userId } = body;
    //console.log("from saveblog =======", title, content, userId);

    if (!title || !content || !userId) {
      console.error("All fields are required");
      return;
    }

    const author = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!author || !author.name) {
      return NextResponse.json(
        {
          message: "Author not found or name is missing",
        },
        {
          status: 404,
        }
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
    console.log("blog", blog);
    return NextResponse.json({
      message: "Blog saved successfully",
    });
  } catch (error) {
    console.error("Error saving blog ", error);
    return NextResponse.json(
      {
        message: "Error uploading blog",
      },
      {
        status: 500,
      }
    );
  }
}
