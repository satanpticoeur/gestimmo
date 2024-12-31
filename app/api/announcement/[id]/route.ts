import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });
  return NextResponse.json(announcement);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const announcement = await prisma.announcement.delete({
    where: { id },
  });
  return NextResponse.json(announcement);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const announcement = await prisma.announcement.update({
    where: { id },
    data: {
      title: "test updated",
      description: "test updated",
      price: 100,
      imageUrls: "image1 updated",
    },
  });
  return NextResponse.json(announcement);
}
