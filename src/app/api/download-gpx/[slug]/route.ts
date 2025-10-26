import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { join } from "path";

const ALLOWED_ORIGINS = ["https://wainroutes.co.uk"];

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, { params }: RouteProps) {
  const referer = req.headers.get("referer");
  if (
    !referer ||
    !ALLOWED_ORIGINS.some((origin) => referer.startsWith(origin))
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { slug } = await params;
  const filePath = join(process.cwd(), "src/data/gpx", `${slug}.gpx`);

  try {
    const stat = statSync(filePath);
    const stream = createReadStream(filePath);

    return new NextResponse(stream as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/gpx+xml",
        "Content-Disposition": `attachment; filename="Wainroutes-walk_${slug}.gpx"`,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
