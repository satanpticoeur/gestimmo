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

export async function POST(request: Request) {
  const { title, description, price, imageUrls } = await request.json();

  await main();
  const announcement = await prisma.announcement.create({
    data: {
      title,
      description,
      price,
      imageUrls,
    },
  });
  return NextResponse.json(announcement);
}

export async function GET() {
  await main();
  const announcements = await prisma.announcement.findMany();
  return NextResponse.json(announcements);
}
