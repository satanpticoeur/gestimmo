import React, { BaseSyntheticEvent } from "react";
import InputDetail from "./Input-Detail";
import InputMainImg from "./Input-Main-Img";
import CTAForm from "./CTA-Form";
import { Button } from "../ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import * as yup from "yup";

type AnnouncementForm = {
  title: string;
  description: string;
  price: number;
  mainImage?: yup.Maybe<yup.AnyObject | null | undefined>;
  otherImage1?: yup.Maybe<yup.AnyObject | null | undefined>;
  otherImage2?: yup.Maybe<yup.AnyObject | null | undefined>;
};

function FormInput({
  onSubmit,
  onAddImage,
  onRemoveImage,
  register,
  errors,
  inputImages,
}: {
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  onAddImage: () => void;
  onRemoveImage: (e: React.MouseEvent<HTMLButtonElement>, imageId: string) => void
  register: UseFormRegister<AnnouncementForm>
  errors: FieldErrors<AnnouncementForm>
  inputImages: { id: string }[]
}) {
  return (
    <form
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
                          onClick={(e) => onRemoveImage(e, image.id)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-red-500">
                        {errors?.[otherImageKey]?.message?.toString()}
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
                onClick={onAddImage}
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

export default FormInput;
