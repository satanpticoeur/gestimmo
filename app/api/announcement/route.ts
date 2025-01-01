import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
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
  const formData = await request.formData();
  console.log("formData", formData);

  // Récupérer les champs texte
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));

  // Récupérer les fichiers
  const mainImage = formData.get("mainImage") as File;
  const otherImage1 = formData.get("otherImage1") as File;
  const otherImage2 = formData.get("otherImage2") as File;

  const mainImageFile = mainImage as File | null;
  const otherImage1File = otherImage1 as File | null;
  const otherImage2File = otherImage2 as File | null;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  let imageUrl1 = null;
  let imageUrl2 = null;
  let imageUrl3 = null;

  await main();
  try {
    if (mainImageFile) {
      const buffer1 = Buffer.from(await mainImageFile?.arrayBuffer()) || null;
      const fileName1 = `${Date.now()}-${mainImageFile?.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "-"
      )}`;
      const filePath1 = path.join(uploadDir, fileName1);
      fs.writeFileSync(filePath1, buffer1);
      imageUrl1 = `/uploads/${fileName1}`;
    }
    if (otherImage1File) {
      const buffer2 = Buffer.from(await otherImage1File?.arrayBuffer()) || null;
      const fileName2 = `${Date.now()}-${otherImage1File?.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "-"
      )}`;
      const filePath2 = path.join(uploadDir, fileName2);
      fs.writeFileSync(filePath2, buffer2);
      imageUrl2 = `${process.env.NEXT_PUBLIC_URL}/uploads/${fileName2}`;
    }
    if (otherImage2File) {
      const buffer3 = Buffer.from(await otherImage2File?.arrayBuffer()) || null;
      const fileName3 = `${Date.now()}-${otherImage2File?.name.replace(
        /[^a-zA-Z0-9.-]/g,
        "-"
      )}`;
      const filePath3 = path.join(uploadDir, fileName3);
      fs.writeFileSync(filePath3, buffer3);
      imageUrl3 = `${process.env.NEXT_PUBLIC_URL}/uploads/${fileName3}`;
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        price,
        imageUrl1,
        imageUrl2,
        imageUrl3,
      },
    });
    return NextResponse.json(announcement);
  } catch (error) {
    console.log(error);
  }
}

export async function GET() {
  await main();
  const announcements = await prisma.announcement.findMany();
  return NextResponse.json(announcements);
}
