"use client";
import { ImgCarousel } from "@/components/announcement/ImgCaroussel";
import Loader from "@/components/Loader";
import React, { use, useEffect, useState } from "react";

type Announcement = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: {
    mainImage: string | null;
    otherImages: (string | null)[];
  };
};

type Params = Promise<{ id: string }>;
function SingleAnnouncementPage(props: { params: Params }) {
  const params = use(props.params);
  const [images, setImages] = useState<Announcement["images"]>({
    mainImage: null,
    otherImages: [],
  });

  const [announcement, setAnnouncement] = useState<Announcement | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAnnouncement = async () => {
      try {
        const response = await fetch(`/api/announcement/${params.id}`);
        const announcement: Announcement = await response.json();
        setAnnouncement(announcement);
        setImages(announcement.images);
        console.log("announcement", announcement);
      } catch (error) {
        console.error("Error fetching announcement:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getAnnouncement();
  }, [params.id]);

  if (isLoading) return <Loader />;
  return (
    <div className="flex flex-col justify-between gap-4">
      <ImgCarousel images={images} announcement={announcement} />
    </div>
  );
}

export default SingleAnnouncementPage;
