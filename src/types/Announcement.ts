import { FieldError, UseFormRegisterReturn } from "react-hook-form";

export type Announcement = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
};


export type RegisterType = UseFormRegisterReturn<string>;

export type ErrorType = FieldError | undefined;

