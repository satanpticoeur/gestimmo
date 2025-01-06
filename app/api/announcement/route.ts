import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(request: Request) {
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));

  const mainImage = formData.get("mainImage") as File;
  const otherImage1 = formData.get("otherImage1") as File;
  const otherImage2 = formData.get("otherImage2") as File;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const images: string[] = [];

  try {
    // Traiter toutes les images
    for (const image of [mainImage, otherImage1, otherImage2]) {
      if (image) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        images.push(`/uploads/${fileName}`);
      }
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        price,
        images
      },
    });
    return NextResponse.json(announcement);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}

export async function GET() {
  const data = await prisma.announcement.findMany();
  const announcements = data.map((announcement) => {
    // Retourner un objet pour chaque annonce, même sans image
    return {
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      price: announcement.price,
      image: announcement.images[0] || announcement.images[1] || announcement.images[2] || null
    };
  });
  return NextResponse.json(announcements);
}
