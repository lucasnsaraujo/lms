import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse as res } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new res("Unauthorized", { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return res.json(course);
  } catch (error) {
    console.log(`[COURSES] ${error}`);
    return new res("Internal Error", { status: 500 });
  }
}
