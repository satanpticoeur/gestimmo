import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function connect() {
    try {
      await prisma.$connect();
      console.log("Connected to database");
    } catch (error) {
      console.log(error);
      await prisma.$disconnect();
      process.exit(1);
    }
  }

export const EDIT = async (id: string) => {
    await connect()
    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (announcement) {
      const images = [
        `/oploads/${announcement.imageUrl1?.split("/uploads/")[1]}`,
        `/oploads/${announcement.imageUrl2?.split("/uploads/")[1]}`,
        `/oploads/${announcement.imageUrl3?.split("/uploads/")[1]}`,
      ].filter((image) => image !== undefined && image !== null);

      const data = {
        title: announcement.title,
        description: announcement.description,
        price: announcement.price,
        mainImage: images.length > 0 ? images[0] : null,
        otherImage1: images.length > 1 ? images[1] : null,
        otherImage2: images.length > 2 ? images[2] : null,
      }

      console.log("from prisma", data)

      return data
    }
  };