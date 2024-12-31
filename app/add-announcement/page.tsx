"use client";
import InputDetail from "@/components/announcement/Input-Detail";
// import InputMainImg from "@/components/announcement/Input-Main-Img";
import CTAForm from "@/components/announcement/CTA-Form";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { JSX, MouseEvent, useState } from "react";

export default function AddAnnouncement() {
  const [inputImages, setInputImages] = useState<JSX.Element[]>([]);

  const handleAddImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const otherImages = document.getElementById("other-images");
    if (otherImages) {
      const newImage = (
          <div key={inputImages.length + 1} className="w-full flex items-center gap-4">
          <input
            type="file"
            name={`other-image${inputImages.length + 1}`}
            accept="image/png, image/jpeg"
            className="border w-full"
          />
          <Button
            variant="outline"
            className="w-fit"
            onClick={(e) => handleRemoveImage(e, inputImages.length)}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      );
      setInputImages([...inputImages, newImage]);
    }
  };

  const handleRemoveImage = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    const newImages = inputImages.filter((_, i) => i !== index);
    setInputImages(newImages);
  };
  return (
    <form action="" encType="multipart/form-data" className="max-[812px]:px-4">
      <div className="border rounded-md text-muted-foreground p-4">
        <header className="border-b pb-4 mb-10">
          <h2 className="text-2xl font-semibold ">Announcement Details</h2>
        </header>
        <div className="flex flex-col gap-4 ">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <InputDetail label="Title" />
            <InputDetail label="Description" />
            <InputDetail label="Price" type="number" />
          </div>
          <div className="flex flex-col gap-4 border-b pb-4 mb-4">
            {/* <InputMainImg /> */}
            <div id="other-images" className="flex flex-col gap-4">
              {inputImages.map((image, index) => (
                <div key={index} className="flex flex-col items-center gap-4">
                  {image}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 justify-end">
              <p className="text-sm/6">Images to add ({inputImages.length}/3) </p>
              <Button
                disabled={inputImages.length >= 3}
                className="w-fit"
                onClick={handleAddImage}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <CTAForm />
        </div>
      </div>
    </form>
  );
}
