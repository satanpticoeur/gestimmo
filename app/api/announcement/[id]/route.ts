import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

type Params = Promise<{ id: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params;
  const id = params.id;
  
  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });

  if (announcement) {
    // Structurer les images selon leur type
    const images = {
      mainImage: announcement.imageUrl1 || null,
      otherImages: [
        announcement.imageUrl2,
        announcement.imageUrl3
      ].filter(Boolean) // Filtrer les valeurs null/undefined
    };

    return NextResponse.json({ 
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      price: announcement.price,
      images
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
  const formData = await request.formData();
  const id = params.id;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));

  const mainImage = formData.get("mainImage") as File | null;
  const otherImage1 = formData.get("otherImage1") as File | null;
  const otherImage2 = formData.get("otherImage2") as File | null;

  let imageUrl1 = null;
  let imageUrl2 = null;
  let imageUrl3 = null;

  const uploadDir = path.join(process.cwd(), "public", "uploads");

  try {
    // Gérer les nouvelles images
    if (mainImage) {
      const buffer = Buffer.from(await mainImage.arrayBuffer());
      const fileName = `${Date.now()}-${mainImage.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imageUrl1 = `/uploads/${fileName}`;
    }
    if (otherImage1) {
      const buffer = Buffer.from(await otherImage1.arrayBuffer());
      const fileName = `${Date.now()}-${otherImage1.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imageUrl2 = `/uploads/${fileName}`;
    }
    if (otherImage2) {
      const buffer = Buffer.from(await otherImage2.arrayBuffer());
      const fileName = `${Date.now()}-${otherImage2.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imageUrl3 = `/uploads/${fileName}`;
    }
    // Répéter pour otherImage1 et otherImage2

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        description,
        price,
        ...(imageUrl1 && { imageUrl1 }),
        ...(imageUrl2 && { imageUrl2 }),
        ...(imageUrl3 && { imageUrl3 }),
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
