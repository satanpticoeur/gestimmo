import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });
  return NextResponse.json(announcement);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  console.log("DELETE request received");
  const id = params.id;
  const announcement = await prisma.announcement.delete({
    where: { id },
  });

  if(announcement) {
    const imagePath = announcement.imageUrl1 || announcement.imageUrl2 || announcement.imageUrl3;
    if(imagePath) {
      
      fs.unlinkSync(path.join(process.cwd(), 'public', imagePath));
    }
  }

  return NextResponse.json(announcement);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
