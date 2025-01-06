import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

type Params = Promise<{ id: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params;
  const id = params.id;
  
  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });

  if (announcement) {
    const images = {
      mainImage: announcement.images[0] || null,
      otherImages: announcement.images.slice(1) || []
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
  segmentData: { params: Params }
) {
  const params = await segmentData.params;
  const id = params.id;
  const announcement = await prisma.announcement.delete({
    where: { id },
  });

  if (announcement) {
    const imagePath1 = announcement.images[0]
    const imagePath2 = announcement.images[1]
    const imagePath3 = announcement.images[2]
    if (imagePath1) {
      fs.unlinkSync(path.join(process.cwd(), "public", imagePath1));
    }
    if (imagePath2) {
      fs.unlinkSync(path.join(process.cwd(), "public", imagePath2));
    }
    if (imagePath3) {
      fs.unlinkSync(path.join(process.cwd(), "public", imagePath3));
    }
  }

  return NextResponse.json(announcement);
}

export async function PUT(
  request: Request,
  segmentData: { params: Params }
) {
  const params = await segmentData.params;
  const id = params.id;
  const formData = await request.formData();

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

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        description,
        price,
        images: [imageUrl1, imageUrl2, imageUrl3].filter(Boolean) as string[],
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
