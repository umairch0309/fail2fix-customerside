import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const paths: string[] = Array.isArray(body.paths) ? body.paths : [];

    if (body.path && typeof body.path === "string") {
      paths.push(body.path);
    }

    for (const path of paths) {
      revalidatePath(path);
    }

    revalidatePath("/blogs");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({
      revalidated: true,
      paths,
      now: Date.now(),
    });
  } catch {
    return NextResponse.json(
      { message: "Invalid revalidation payload" },
      { status: 400 },
    );
  }
}
