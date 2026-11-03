"use client";

import { Check, MoreVertical, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface NotificationItemMenuProps {
  notificationId: string;
  isRead: boolean;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItemMenu({
  notificationId,
  isRead,
  onMarkAsRead,
  onDelete,
}: NotificationItemMenuProps) {
  const t = useTranslations("notifications");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-muted hover:text-text-plain flex-shrink-0"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 bg-bg-elevated">
        {!isRead && (
          <DropdownMenuItem
            onClick={() => onMarkAsRead(notificationId)}
            className="gap-2 cursor-pointer text-text-plain hover:bg-bg-muted"
          >
            <Check className="h-4 w-4" />
            <span>{t("markAsRead")}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => onDelete(notificationId)}
          className="gap-2 cursor-pointer text-text-danger hover:bg-bg-danger-fade focus:text-text-danger"
        >
          <Trash2 className="h-4 w-4" />
          <span>{t("delete")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
