import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  console.log("hi");
  const { id } = params;
  const { newCanvasFile: canvasFile } = await request.json();
  await connectMongoDB();
  await Topic.findByIdAndUpdate(id, { canvasFile });
  return NextResponse.json({ message: "Updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const topic = await Topic.findOne({ _id: id });
  return NextResponse.json({ topic }, { status: 200 });
}
