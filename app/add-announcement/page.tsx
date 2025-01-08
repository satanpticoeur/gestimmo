"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { announcementSchema } from "@/yup/schema";
import FormInput from "@/components/announcement/Form-Input";

export default function AddAnnouncementPage() {
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

    const response = await fetch("/api/announcement",
      {
        method: "POST",
        body: formData,
      }
    );
    console.log("response", response);

    if (response.ok) {
      reset();
      router.push("/");
    } else {
      console.error("Erreur lors de la création de l'annonce");
    }
  });

  return (
    <>
      <FormInput
        onSubmit={onSubmit}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        register={register}
        errors={errors}
        inputImages={inputImages}
      />
    </>
  );
}
