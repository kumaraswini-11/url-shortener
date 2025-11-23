"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Delete confirmation using AlertDialog component
// NOTE: Dialog component is for for general purpose.
export function DeleteAction({
  code,
  onDelete,
}: {
  code: string;
  onDelete: (code: string) => void;
}) {
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      onDelete(code);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={pending}
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Delete link {code}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete short link permanently?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete <code className="font-mono font-bold">{code}</code>{" "}
            forever. This action <strong>cannot</strong> be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={pending}>
            {pending ? "Deleting..." : "Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
