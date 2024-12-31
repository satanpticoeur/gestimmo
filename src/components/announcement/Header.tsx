import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b p-4 bg-background">
      <nav className="flex items-center justify-between max-w-3xl mx-auto">
        <h3>
          <Link href="/">
            <code className="p-1 border rounded-md">
            Gest
            <span className="text-indigo-600">immo</span>
            </code>
          </Link>
        </h3>
        <div className="flex overflow-hidden group">
          <Button variant="outline">
            <Link
              href="/add-announcement"
              className="flex items-center gap-2 "
            >
              <span className="font-bold">Add announcement</span>
              <Plus className="" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
