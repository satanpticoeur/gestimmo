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
import { Announcement } from "@/types/Announcement";
import { Pencil, Trash } from "lucide-react";

export function AnnouncementList({announcements}: {announcements: Announcement[]}) {
  
  return (
    <Table className="border rounded-md">
      <TableCaption>A list of your recent announcements.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {announcements.map((announcement: Announcement) => (
          <TableRow key={announcement.id}>
            <TableCell >
              {announcement.imageUrls}
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
