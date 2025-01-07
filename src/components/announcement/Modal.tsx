
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash } from "lucide-react"

export default function Modal({ onDelete }: { onDelete: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
            <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suppression de l&apos;annonce</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de supprimer l&apos;annonce.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Annuler
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={onDelete}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
