import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

export async function POST() {
  //   const { title, description, price, imageUrl } = await request.json();
  await main();
  const announcement = await prisma.announcement.create({
    data: {
      title: "test",
      description: "test",
      price: 100,
      imageUrls: "image1",
    },
  });
  return NextResponse.json(announcement);
}

export async function GET() {
  await main();
  const announcements = await prisma.announcement.findMany();
  return NextResponse.json(announcements);
}
