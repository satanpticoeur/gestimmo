import { Input } from "../ui/input";
import { ErrorType, RegisterType } from "@/types/Announcement";


function InputDetail({
  label,
  type,
  register,
  errors,
}: {
  label: string;
  type?: string;
  register: RegisterType;
  errors: ErrorType;
}) {
  return (
    <div className="md:col-span-2 ">
      <label htmlFor={label} className="block text-sm/6 font-medium">
        {label}
      </label>
      <Input type={type || "text"} {...register} />
      {errors && <p className="text-red-500">{errors.message}</p>}
    </div>
  );
}

export default InputDetail;
