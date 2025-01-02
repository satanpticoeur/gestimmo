import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

type Params = Promise<{ id: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params;
  const id = params.id;
  console.log("GET request received for id:", id);
  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });
  if (announcement) {
    const images = [
      announcement.imageUrl1,
      announcement.imageUrl2,
      announcement.imageUrl3,
    ].filter((image) => image !== undefined && image !== null);

    console.log(images)
    return NextResponse.json({ 
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      price: announcement.price,
      images: images.length > 0 ? images : ["/images/placeholder.png"]
    });
  }
  return NextResponse.json({ error: "Announcement not found" });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("DELETE request received");
  const id = params.id;
  const announcement = await prisma.announcement.delete({
    where: { id },
  });

  if (announcement) {
    const imagePath =
      announcement.imageUrl1 ||
      announcement.imageUrl2 ||
      announcement.imageUrl3;
    if (imagePath) {
      fs.unlinkSync(path.join(process.cwd(), "public", imagePath));
    }
  }

  return NextResponse.json(announcement);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const announcement = await prisma.announcement.update({
    where: { id },
    data: {
      title: "test updated",
      description: "test updated",
    },
  });
  return NextResponse.json(announcement);
}
