import { Plus } from "lucide-react";
import Link from "next/link";
export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full border-b p-4 bg-background backdrop-blur-lg">
      <nav className="flex items-center justify-between max-w-3xl mx-auto">
        <h3>
          <Link href="/">
            <code className="p-1 border rounded-md">GestImmo</code>
          </Link>
        </h3>
        <div className="flex overflow-hidden">
          <Link
            href="/add-announcement"
            className="flex items-center gap-2 text-sm bg-primary text-primary-foreground border rounded-md px-2 py-1 group"
          >
            <span className="font-bold">Add announcement</span>
            <Plus className="translate-y-10 w-0 group-hover:w-4 group-hover:translate-y-0 transition-all duration-300"/>
          </Link>
        </div>
      </nav>
    </header>
  );
}
