"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "dms-pressable dms-field flex h-[var(--control-md)] w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-border bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 shrink-0 opacity-60 transition-transform duration-200" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      <ChevronUp className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-raised text-foreground shadow-raised duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1.5",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-[var(--radius-sm)] py-2 pr-8 pl-2.5 text-sm outline-none transition-colors duration-100 hover:bg-secondary focus:bg-secondary focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4 text-primary" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

const RADIX_EMPTY_VALUE = "__EMPTY_SELECT_VALUE__";

function toRadixValue(val: unknown) {
  const str = String(val ?? "");
  return str === "" ? RADIX_EMPTY_VALUE : str;
}

function fromRadixValue(val: string) {
  return val === RADIX_EMPTY_VALUE ? "" : val;
}

function StudioSelect({
  autoFocus,
  children,
  className,
  disabled,
  id,
  name,
  onChange,
  required,
  value,
  ...props
}: React.ComponentProps<"select">) {
  const nativeSelectRef = React.useRef<HTMLSelectElement>(null);

  const options = React.useMemo(() => {
    const list: Array<{ disabled?: boolean; label: string; value: string }> =
      [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === "option") {
        const p = child.props as {
          children?: React.ReactNode;
          disabled?: boolean;
          value?: string;
        };
        list.push({
          disabled: p.disabled,
          label: String(p.children ?? ""),
          value: String(p.value ?? ""),
        });
      }
    });
    return list;
  }, [children]);

  const placeholderOption = options.find((opt) => opt.value === "");
  const placeholder = placeholderOption?.label || "Select an option";
  const currentRadixValue = toRadixValue(value);

  const handleRadixChange = (nextRadixVal: string) => {
    const rawVal = fromRadixValue(nextRadixVal);
    if (nativeSelectRef.current) {
      nativeSelectRef.current.value = rawVal;
      const event = new Event("change", { bubbles: true });
      nativeSelectRef.current.dispatchEvent(event);
    }
  };

  return (
    <div className="relative w-full">
      {/* Studio Radix Custom Select (Visible to human users) */}
      <Select
        disabled={disabled}
        onValueChange={handleRadixChange}
        value={currentRadixValue}
      >
        <SelectTrigger
          autoFocus={autoFocus}
          className={cn(
            "h-11 rounded-[var(--radius-md)] border-border/80 bg-background/60 px-3.5 text-sm shadow-xs backdrop-blur-xs transition-all hover:border-foreground/20 focus:border-foreground/30 focus:bg-background",
            className,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-72 rounded-[var(--radius-lg)] border-border/80 bg-popover/95 shadow-raised backdrop-blur-md">
          {options.map((option) => (
            <SelectItem
              className="py-2.5 text-sm font-medium"
              disabled={option.disabled}
              key={toRadixValue(option.value)}
              value={toRadixValue(option.value)}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Synchronized select for accessibility and automated test contracts */}
      <select
        className="sr-only absolute inset-0 size-full cursor-default opacity-0"
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
        ref={nativeSelectRef}
        required={required}
        tabIndex={-1}
        value={value}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

const NativeSelect = StudioSelect;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  NativeSelect,
  StudioSelect,
};
