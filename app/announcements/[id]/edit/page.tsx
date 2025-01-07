"use client";
import InputDetail from "@/components/announcement/Input-Detail";
import CTAForm from "@/components/announcement/CTA-Form";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputMainImg from "@/components/announcement/Input-Main-Img";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { announcementSchema } from "@/yup/schema";

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [inputImages, setInputImages] = useState<Array<{ id: string }>>([]);
  const [existingImages, setExistingImages] = useState({
    mainImage: "",
    otherImages: [] as string[],
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(announcementSchema),
  });

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/announcement/${id}`
        );
        const data = await response.json();
        console.log(data);

        setValue("title", data.title);
        setValue("description", data.description);
        setValue("price", data.price);

        setExistingImages({
          mainImage: data.images.mainImage || "",
          otherImages: data.images.otherImages || [],
        });

        if (data.images.otherImages?.length > 0) {
          setInputImages(
            data.images.otherImages.map(() => ({
              id: crypto.randomUUID(),
            }))
          );
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'annonce:", error);
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id, setValue]);

  const handleAddImage = () => {
    const otherImages = document.getElementById("other-images");
    if (otherImages && inputImages.length < 2) {
      const newImage = {
        id: crypto.randomUUID(),
      };
      setInputImages((prev) => [...prev, newImage]);
    }
  };

  const handleRemoveImage = (
    e: React.MouseEvent<HTMLButtonElement>,
    imageId: string
  ) => {
    e.stopPropagation();
    setInputImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const onSubmit = handleSubmit(async (data) => {
    const { title, description, price, mainImage, otherImage1, otherImage2 } =
      data;
    console.log(data);

    const mainImageFile = mainImage as FileList;
    const otherImage1File = otherImage1 as FileList;
    const otherImage2File = otherImage2 as FileList;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());

    // Ajouter les images si elles existent
    if (mainImageFile?.[0]) formData.append("mainImage", mainImageFile[0]);
    if (otherImage1File?.[0])
      formData.append("otherImage1", otherImage1File[0]);
    if (otherImage2File?.[0])
      formData.append("otherImage2", otherImage2File[0]);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/announcement/${id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (response.ok) {
      router.push(`/announcements/${id}`);
    }
  });

  return (
    <form
      action=""
      method="post"
      onSubmit={onSubmit}
      encType="multipart/form-data"
      className="max-[812px]:px-4"
    >
      <div className="border rounded-md text-muted-foreground p-4">
        <header className="border-b pb-4 mb-10">
          <h2 className="text-2xl font-semibold ">Announcement Details</h2>
        </header>
        <div className="flex flex-col gap-4 ">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <InputDetail
              label="Title"
              register={register("title")}
              errors={errors.title}
            />
            <InputDetail
              label="Description"
              register={register("description")}
              errors={errors.description}
            />
            <InputDetail
              label="Price"
              type="number"
              register={register("price")}
              errors={errors.price}
            />
          </div>

          <div className="flex flex-col gap-4 border-b pb-4 mb-4">
            <InputMainImg
              register={register("mainImage")}
              errors={errors.mainImage}
              existingImage={existingImages.mainImage}
            />
            {/* Other Images */}
            <div id="other-images" className="flex flex-col gap-4">
              {inputImages.length > 0 &&
                inputImages.map((image, index) => {
                  const otherImageKey = `otherImage${index + 1}` as
                    | "otherImage1"
                    | "otherImage2";
                  return (
                    <div key={image.id}>
                      <div
                        key={image.id}
                        className="w-full flex items-center gap-4"
                      >
                        <div className="w-full">
                          {existingImages.otherImages[index] && (
                            <Image
                              src={existingImages.otherImages[index]}
                              alt={`Image ${index + 1}`}
                              width={100}
                              height={100}
                              className="object-cover mb-2"
                            />
                          )}
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            className={`border w-full ${
                              errors?.[otherImageKey] ? "border-red-500" : ""
                            }`}
                            {...register(otherImageKey)}
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="w-fit"
                          onClick={(e) => handleRemoveImage(e, image.id)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-red-500">
                        {errors?.[otherImageKey]?.message}
                      </p>
                    </div>
                  );
                })}
            </div>
            <div className="flex items-center gap-4 justify-end">
              <p className="text-sm/6">
                Images to add ({inputImages.length}/2)
              </p>
              <Button
                type="button"
                disabled={inputImages.length >= 2}
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
