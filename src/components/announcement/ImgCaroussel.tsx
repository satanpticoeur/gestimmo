import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface Announcement {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
}

export function ImgCarousel({
  images,
  announcement,
}: {
  images: string[];
  announcement: Announcement | undefined;
}) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );
  const [currentImage, setCurrentImage] = React.useState(
    "/oploads/placeholder.png"
  );
  React.useEffect(() => {
    setCurrentImage(images[0]);
  }, [images]);

  return (
    <main className="h-screen">
      <div className="h-full flex flex-col justify-center gap-4 ">
        <div className="w-fit flex-1 overflow-hidden self-center rounded-lg">
          <Image
            src={currentImage}
            alt="announcement"
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex justify-between gap-16">
          <Carousel
            className="w-full max-w-32 ml-12"
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index} className="">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <Image
                          src={image}
                          alt="announcement"
                          width={500}
                          height={500}
                          className="object-cover w-full h-full"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>{announcement?.title}</CardTitle>
              <CardDescription className="text-2xl font-bold text-indigo-500">
                {announcement?.price}€
              </CardDescription>
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
