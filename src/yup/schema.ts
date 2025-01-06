/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup";

export const imageSchema = yup
  .mixed()
  .nullable()
  .notRequired()
  .test("is-valid-type", "File type is not valid. Accepted types are (png, jpeg, jpg)", (value: any) => {
    if (!value || !value[0]) return true;
    const file = value[0] as File;
    const isValid = ["image/png", "image/jpeg", "image/jpg"].includes(
      file.type
    );
    return isValid;
  })
  .test("file-size", "File size is too large (max 2 MB )", (value: any) => {
      if (!value || !value[0]) return true;
      const file = value[0] as File;
      return file.size <= 2 * 1024 * 1024;
    }
  );

export const announcementSchema = yup.object({
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