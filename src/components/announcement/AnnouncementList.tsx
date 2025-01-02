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

interface Announcement {
  title: string;
  description: string;
  price: number;
  image: string;
}

export function AnnouncementList({
  announcements,
}: {
  announcements: Announcement[];
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
          <TableRow key={index} className="">
            <TableCell className="">
              <div className="w-14 h-14 rounded-full overflow-hidden"> 
                <Image
                  src={announcement.image}
                  alt={announcement.title}
                  width={500}
                  height={500}
                  className="object-cover w-full h-full"
              />
              </div>
            </TableCell>
            <TableCell className="font-medium">{announcement.title}</TableCell>
            <TableCell>{announcement.price}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline">
                <Pencil />
              </Button>
              <Button variant="outline" className=" hover:bg-destructive ml-2">
                <Trash />
              </Button>
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
