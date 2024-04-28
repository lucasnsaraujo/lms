import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();
    // Separate the isPublished value from the rest of the values
    // There is a separate endpoint for publishing/unpublishing chapters

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) return new NextResponse("Unauthorized", { status: 401 });

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: values,
    });

    // TO-DO - Handle video uploading

    return NextResponse.json(chapter);
  } catch (error: any) {
    console.log("[COURSES_CHAPTER_ID] ", error.message);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
