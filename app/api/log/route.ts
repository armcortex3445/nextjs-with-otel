import { NextRequest, NextResponse } from "next/server";
import { serverLogger } from "../../../util/winston";

export async function POST(req: NextRequest) {
  try {
    // const apiKey = req.headers.get(ENUM_HEADER_LOG.INTERNAL_API_KEY);

    // if (apiKey !== process.env.INTERNAL_LOG_API_KEY) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();
    serverLogger.info(body);
    return NextResponse.json({ status: "ok" });
  } catch (e) {
    serverLogger.error("Failed to log", e);
    return NextResponse.json({ error: "failed to log" }, { status: 500 });
  }
}
