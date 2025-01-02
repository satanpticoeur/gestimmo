import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Announcement {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export function AnnouncementList({
  announcements,
  onDelete,
}: {
  announcements: Announcement[];
  onDelete: (id: string) => void;
}) {
  return (
    <Table className="border p-4">
      <TableCaption>A list of your recent announcements.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-14">Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {announcements.map((announcement: Announcement, index: number) => (
             <TableRow key={index}>
              <TableCell>
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <Link href={`/announcements/${announcement.id}`}>
                    <Image
                      src={announcement.image}
                      alt={announcement.title}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full"
                  />
                  </Link>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {announcement.title}
              </TableCell>
              <TableCell>{announcement.price}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Button variant="outline">
                    <Link href={`/announcements/${announcement.id}/edit`}>
                      <Pencil />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="hover:bg-destructive ml-2"
                    onClick={() => onDelete(announcement.id)}
                  >
                    <Trash />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}
