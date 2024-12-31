import React from "react";
import { Button } from "../ui/button";

function CTAForm() {
  return (
    <div className="flex items-center justify-end gap-x-6">
      <Button type="button" variant="outline">
        Cancel
      </Button>
      <Button
        type="submit"
        className="bg-indigo-600 text-foreground hover:bg-indigo-500 focus-visible:outline-indigo-600"
      >
        Save
      </Button>
    </div>
  );
}

export default CTAForm;
