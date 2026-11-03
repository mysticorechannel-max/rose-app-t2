"use client";

import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { ChevronDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-lg bg-bg-plain text-foreground",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center border-b border-border-soft px-4"
    cmdk-input-wrapper=""
  >
    <Search className="me-2 size-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-12 w-full bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-x-hidden overflow-y-auto", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn(
      "py-6 text-center text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("h-px bg-border-soft", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex min-h-12 cursor-default items-center gap-2 rounded-none px-4 text-sm outline-hidden select-none",
      "data-[selected=true]:bg-bg-muted data-[selected=true]:text-text-primary",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:text-text-muted",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ms-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

/* ------------------------------------------------------------------ */
/* Combobox: Popover + Command                                         */
/* ------------------------------------------------------------------ */

type ComboboxOption = { value: string; label: string; disabled?: boolean };

type ComboboxProps = {
  options?: ComboboxOption[];
  loadOptions?: (
    query: string,
    signal: AbortSignal
  ) => Promise<ComboboxOption[]>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
};

function Combobox({
  options = [],
  loadOptions,
  value,
  defaultValue = "",
  onValueChange,
  placeholder,
  searchPlaceholder,
  id,
  disabled,
  className,
  "aria-invalid": ariaInvalid,
}: ComboboxProps) {
  const t = useTranslations("select");
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [asyncOptions, setAsyncOptions] = React.useState<ComboboxOption[]>([]);
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">(
    "idle"
  );
  const [selectedOption, setSelectedOption] =
    React.useState<ComboboxOption>();

  const currentValue = value ?? internalValue;
  const items = loadOptions ? asyncOptions : options;
  const selected =
    items.find((o) => o.value === currentValue) ??
    (selectedOption?.value === currentValue ? selectedOption : undefined);

  // Async search: abort the previous request so a slow response
  // can never overwrite newer results.
  React.useEffect(() => {
    if (!loadOptions || !open) return;
    const controller = new AbortController();
    setStatus("loading");
    loadOptions(search, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setAsyncOptions(result);
        setStatus("idle");
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setStatus("error");
      });
    return () => controller.abort();
  }, [loadOptions, open, search]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setSearch(""); // Escape / outside click / select: reset search
  }

  function handleSelect(option: ComboboxOption) {
    if (value === undefined) setInternalValue(option.value);
    setSelectedOption(option);
    onValueChange?.(option.value);
    handleOpenChange(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={cn(
            "flex h-[49px] w-full items-center justify-between gap-2 rounded-lg border border-border-soft bg-bg-plain px-4 text-sm text-foreground outline-hidden focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-border-danger disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span
            className={cn(
              "min-w-0 truncate text-start",
              !selected && "text-muted-foreground"
            )}
          >
            {selected ? selected.label : (placeholder ?? t("placeholder"))}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 opacity-50 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) overflow-hidden p-0"
      >
        <Command
          shouldFilter={!loadOptions}
          filter={(itemValue, query) =>
            itemValue.toLowerCase().includes(query.trim().toLowerCase())
              ? 1
              : 0
          }
        >
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={searchPlaceholder ?? t("search")}
          />
          <CommandList>
            {status === "loading" && (
              <div
                role="status"
                className="px-4 py-3 text-sm text-muted-foreground"
              >
                {t("loading")}
              </div>
            )}
            {status === "error" && (
              <div
                role="alert"
                className="px-4 py-3 text-sm text-muted-foreground"
              >
                {t("error")}
              </div>
            )}
            {status === "idle" && (
              <>
                <CommandEmpty>{t("noOptions")}</CommandEmpty>
                <CommandGroup className="p-0">
                  {items.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      disabled={option.disabled}
                      onSelect={() => handleSelect(option)}
                      className={cn(
                        currentValue === option.value &&
                          "bg-bg-muted text-text-primary"
                      )}
                    >
                      <span className="min-w-0 truncate">{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  Combobox,
};
export type { ComboboxOption };