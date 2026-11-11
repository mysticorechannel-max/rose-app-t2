"use client";

import { Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

type DeleteAccountDialogProps = {
  onConfirm: () => void;
};

export function DeleteAccountDialog({ onConfirm }: DeleteAccountDialogProps) {
  // Translation
  const t = useTranslations("account");

  // State
  const [isOpen, setIsOpen] = React.useState(false);

  // Functions
  function handleConfirm(): void {
    onConfirm();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" className="text-text-danger">
          {t("profile.delete")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl p-8 sm:rounded-2xl [&>button:last-child]:hidden">
        {/* Own close button: RTL-aware (end-4) and translated */}
        <DialogClose className="absolute end-4 top-4 rounded-sm text-text-muted opacity-70 outline-hidden transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring">
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">{t("deleteDialog.close")}</span>
        </DialogClose>

        <DialogHeader className="items-center gap-4 space-y-0 text-center sm:text-center">
          <div className="flex size-28 items-center justify-center rounded-full bg-bg-muted">
            <div className="flex size-20 items-center justify-center rounded-full bg-bg-soft">
              <Trash2 className="size-7 text-text-plain" aria-hidden="true" />
            </div>
          </div>
          <DialogTitle className="text-xl">
            {t("deleteDialog.title")}
          </DialogTitle>
          <DialogDescription className="text-text-danger">
            {t("deleteDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-3 sm:grid sm:grid-cols-2 sm:space-x-0">
          <DialogClose asChild>
            <Button type="button" variant="subtle" className="w-full">
              {t("deleteDialog.cancel")}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={handleConfirm}
          >
            {t("deleteDialog.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}