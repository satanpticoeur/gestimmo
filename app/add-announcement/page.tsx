/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import InputDetail from "@/components/announcement/Input-Detail";
import CTAForm from "@/components/announcement/CTA-Form";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputMainImg from "@/components/announcement/Input-Main-Img";
import { useRouter } from "next/navigation";

const imageSchema = yup
  .mixed()
  .nullable()
  .notRequired()
  .test("is-valid-type", "Le type d'image n'est pas valide", (value: any) => {
    if (!value || !value[0]) return true;
    const file = value[0] as File;
    const isValid = ["image/png", "image/jpeg", "image/jpg"].includes(
      file.type
    );
    return isValid;
  })
  .test("file-size", "L'image est trop volumineuse (max 200 Ko)", (value: any) => {
      if (!value || !value[0]) return true;
      const file = value[0] as File;
      return file.size <= 200 * 1024;
    }
  );

const announcementSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(1, "Price must be greater than 0")
    .required("Price is required"),
  mainImage: imageSchema,
  otherImage1: imageSchema,
  otherImage2: imageSchema,
});

export default function AddAnnouncement() {
  const router = useRouter();
  const [inputImages, setInputImages] = useState<Array<{ id: string }>>([]);

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(announcementSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const { title, description, price, mainImage, otherImage1, otherImage2 } =
      data;

    const mainImageFile = mainImage as FileList;
    const otherImage1File = otherImage1 as FileList;
    const otherImage2File = otherImage2 as FileList;

    // Créer un objet FormData
    const formData = new FormData();

    // Ajouter les champs texte
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());

    // Ajouter les images si elles existent
    if (mainImageFile?.[0]) formData.append("mainImage", mainImageFile[0]);
    if (otherImage1File?.[0])
      formData.append("otherImage1", otherImage1File[0]);
    if (otherImage2File?.[0])
      formData.append("otherImage2", otherImage2File[0]);

    const response = await fetch("http://localhost:3000/api/announcement", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      reset();
      router.push("/");
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
            />
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
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          className={`border w-full ${
                            errors?.[otherImageKey] ? "border-red-500" : ""
                          }`}
                          {...register(otherImageKey)}
                        />
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
