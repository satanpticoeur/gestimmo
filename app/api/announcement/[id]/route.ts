import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { deleteImageFromBlob, uploadImageToBlob } from "@/lib/blob";

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
      otherImages: announcement.images.slice(1) || [],
    };

    return NextResponse.json({
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      price: announcement.price,
      images,
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
  const existingAnnouncement = await prisma.announcement.findUnique({
    where: { id },
  });

  if (existingAnnouncement) {
    for (const image of existingAnnouncement.images) {
      if (image) {
        await deleteImageFromBlob(image);
      }
    }
    await prisma.announcement.delete({
      where: { id },
    });
  }

  return NextResponse.json({ message: "Announcement deleted" });
}

export async function PUT(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params;
  const id = params.id;
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));

  //new images
  const mainImage = formData.get("mainImage") as File | null;
  const otherImage1 = formData.get("otherImage1") as File | null;
  const otherImage2 = formData.get("otherImage2") as File | null;

  try {
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
      select: {
        images: true,
      },
    });
    const newImages: string[] = [];

    if (existingAnnouncement) {
      // Gérer l'image principale
      if (mainImage) {
        if (existingAnnouncement.images[0]) {
          await deleteImageFromBlob(existingAnnouncement.images[0]);
        }
        const blob = await uploadImageToBlob(mainImage);
        newImages.push(blob.url);
      } else if (existingAnnouncement.images[0]) {
        newImages.push(existingAnnouncement.images[0]);
      }

      // Gérer la première image secondaire
      if (otherImage1) {
        if (existingAnnouncement.images[1]) {
          await deleteImageFromBlob(existingAnnouncement.images[1]);
        }
        const blob = await uploadImageToBlob(otherImage1);
        newImages.push(blob.url);
      } else if (existingAnnouncement.images[1]) {
        newImages.push(existingAnnouncement.images[1]);
      }

      // Gérer la deuxième image secondaire
      if (otherImage2) {
        if (existingAnnouncement.images[2]) {
          await deleteImageFromBlob(existingAnnouncement.images[2]);
        }
        const blob = await uploadImageToBlob(otherImage2);
        newImages.push(blob.url);
      } else if (existingAnnouncement.images[2]) {
        newImages.push(existingAnnouncement.images[2]);
      }

      const updatedAnnouncement = await prisma.announcement.update({
        where: { id },
        data: {
          title,
          description,
          price,
          images: newImages,
        },
      });

      return NextResponse.json(updatedAnnouncement);
    }
    return NextResponse.json(
      { error: "Announcement not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
