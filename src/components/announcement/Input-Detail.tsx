import React from "react";
import { Input } from "../ui/input";

function InputDetail({ label, type }: { label: string, type?: string }) {
  return (
    <div className="md:col-span-2 ">
      <label htmlFor={label} className="block text-sm/6 font-medium">
        {label}
      </label>
      <Input type={type || "text"} />
    </div>
  );
}

export default InputDetail;
