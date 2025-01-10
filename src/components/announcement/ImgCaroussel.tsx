import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  description: string;
  price: number;
  images: {
    mainImage: string | null;
    otherImages: (string | null)[];
  };
}
export function ImgCarousel({
  images,
  announcement,
}: {
  images: {
    mainImage: string | null;
    otherImages: (string | null)[];
  };
  announcement: Announcement | undefined;
}) {
  const imageArray = React.useMemo(
    () => [images.mainImage, ...images.otherImages],
    [images.mainImage, images.otherImages]
  );

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentImage, setCurrentImage] = React.useState(
    imageArray[0] || "/images/placeholder.png"
  );

  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      const selectedIndex = api.selectedScrollSnap();
      const selectedImage =
        imageArray[selectedIndex] || "/images/placeholder.png";
      setCurrentImage(selectedImage);
    });
  }, [api, imageArray]);

  return (
    <main className="h-screen max-[812px]:p-4">
      <div className="h-full flex flex-col justify-center gap-4 ">
        <div className="w-full flex-1 overflow-hidden self-center rounded-lg">
          <Image
            src={currentImage}
            alt="announcement"
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-16">
          {images.otherImages.length > 0 && (
            <Carousel
              className="w-full max-w-32 ml-12"
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              setApi={setApi}
            >
              <CarouselContent>
                {[...images.otherImages, images.mainImage].map(
                  (image, index) => (
                    <CarouselItem key={index} className="">
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <Image
                              src={image || ""}
                              alt="announcement"
                              width={500}
                              height={500}
                              className="object-cover w-full h-full"
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  )
                )}
              </CarouselContent>

              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
          <Card className="flex-1">
            <CardHeader className="flex-row justify-between">
              <>
                <CardTitle>{announcement?.title}</CardTitle>
                <span className="text-2xl font-bold text-indigo-500">
                  {announcement?.price}€
                </span>
              </>
              <Link href={`/announcement/${announcement?.id}/edit`}>
                <Button variant="outline">
                  <Pencil />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <p>{announcement?.description}</p>
            </CardContent>
          </Card>{" "}
        </div>
      </div>
    </main>
  );
}
