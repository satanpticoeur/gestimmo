import Image from "next/image";

interface InputMainImgComponentProps {
  register: any;
  errors: any;
  existingImage?: string;
}
export default function InputMainImg({
  register,
  errors,
  existingImage,
}: InputMainImgComponentProps) {
  return (
    <div>
      {existingImage && (
        <Image
          src={existingImage}
          alt="Image principale"
          width={500}
          height={500}
          className="w-full object-cover mb-2"
        />
      )}
      <input
        type="file"
        accept="image/png, image/jpeg"
        className={`border w-full ${errors ? "border-red-500" : ""}`}
        {...register}
      />
      {errors && <p className="text-red-500">{errors.message}</p>}
    </div>
  );
}
