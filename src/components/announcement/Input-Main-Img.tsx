import React, { useState, useCallback, useEffect  } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn,
} from "react-hook-form";

type InputMainImgProps = UseFormRegisterReturn<string>;

interface InputMainImgComponentProps {
  register: InputMainImgProps;
  errors: Merge<FieldError, FieldErrorsImpl<object>> | undefined;
  existingImage?: string;
}

function InputMainImg({ register, errors, existingImage }: InputMainImgComponentProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUrl(existingImage || null);
  }, [existingImage]);

  const handleFiles = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        setErrorMessage("Le fichier doit être une image");
        return;
      }

      setErrorMessage(null);
      const newPreviewUrl = URL.createObjectURL(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(newPreviewUrl);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;
    handleFiles(files);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 ${
          isDragging ? "bg-gray-100" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="col-span-full">
          <label htmlFor="cover-photo" className="block text-sm/6 font-medium">
            Image principale
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10">
            <div className="text-center">
              <div className="mt-4 flex text-sm/6">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-semibold px-1 bg-foreground text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/png, image/jpeg"
                    className={`sr-only`}
                    {...register}
                    onChange={(e) => {
                      register.onChange(e);
                      handleFileChange(e);
                    }}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs/5 text-gray-600">PNG, JPG up to 2MB</p>

              <p className="text-red-500 text-sm mt-1">
                {errorMessage && errorMessage} {"\n"}
                {errors?.message && errors?.message}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de prévisualisation */}
      {previewUrl && (
        <div className="mt-4">
          <div className="relative group">
            <Image
              src={previewUrl}
              alt="Preview"
              width={500}
              height={500}
              className="w-full h-full object-top object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InputMainImg;
