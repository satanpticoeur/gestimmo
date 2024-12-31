import React from "react";
import { Input } from "../ui/input";

function InputMainImg() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div className="col-span-full">
        <label htmlFor="cover-photo" className="block text-sm/6 font-medium ">
          Main Image
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
                  name="file-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs/5 text-gray-600">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputMainImg;
