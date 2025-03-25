import * as React from "react";
import { CheckIcon, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Dispatch, SetStateAction } from "react";
import { Separator } from "@/components/ui/separator";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type SelectOption = {
  value: string;
  label: string;
  id?: string; // Added for compatibility with the second example
  name?: string; // Added for compatibility with the second example
  icon?: React.ComponentType<{ className?: string }>;
};

export interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  truncateCount?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showSelectAll?: boolean;
  renderOption?: (option: SelectOption) => React.ReactNode;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  truncateCount = 3,
  disabled = false,
  className,
  style,
  showSelectAll = true,
  renderOption,
}) => {
  // Normalize options from both formats
  const normalizedOptions = React.useMemo(() => {
    return options.map(option => ({
      value: option.value || option.id || "",
      label: option.label || option.name || "",
      icon: option.icon
    }));
  }, [options]);

  const [selectedValue, setSelectedValue] = React.useState<string[]>(value);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const onOptionSelect = (option: string) => {
    const newSelectedValues = selectedValue.includes(option)
      ? selectedValue.filter((value) => value !== option)
      : [...selectedValue, option];
    setSelectedValue(newSelectedValues);
    onChange(newSelectedValues);
  };

  const onClearAllOptions = () => {
    setSelectedValue([]);
    onChange([]);
  };

  const toggleAll = () => {
    if (selectedValue.length === normalizedOptions.length) {
      onClearAllOptions();
    } else {
      const allValues = normalizedOptions.map((option) => option.value);
      setSelectedValue(allValues);
      onChange(allValues);
    }
  };

  // Sync with external value changes
  React.useEffect(() => {
    if (isPopoverOpen && JSON.stringify(value) !== JSON.stringify(selectedValue)) {
      setSelectedValue(value);
    }
  }, [isPopoverOpen, value, selectedValue]);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setIsPopoverOpen((prev) => !prev)}
          variant="outline"
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-auto min-h-11 w-full items-center justify-between p-1 [&_svg]:pointer-events-auto",
            "hover:bg-transparent",
            disabled && "[&_svg]:pointer-events-none",
            className
          )}
          style={style}
        >
          {selectedValue.length > 0 ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-wrap items-center px-1">
                {selectedValue.slice(0, truncateCount).map((value, index) => {
                  const option = normalizedOptions.find((o) => o.value === value);

                  if (!option) {
                    return <div key={`${index}-${value}`}></div>;
                  }

                  if (renderOption) {
                    return <div key={`${index}-${value}`}>{renderOption(option)}</div>;
                  }

                  return (
                    <Badge
                      key={`${index}-${value}`}
                      className={cn(
                        "mr-1 cursor-default border-transparent bg-muted text-foreground hover:bg-muted"
                      )}
                    >
                      {option?.icon && <option.icon className="mr-1 h-3.5 w-3.5" />}
                      {option?.label}
                      <X
                        className="ml-1 h-3.5 w-3.5 cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOptionSelect(value);
                        }}
                      />
                    </Badge>
                  );
                })}
                {selectedValue.length > truncateCount && (
                  <div className={cn("cursor-default py-1 pl-1.5 text-muted-foreground")}>
                    {`+${selectedValue.length - truncateCount}`}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <X
                  className="h-4 mx-2 cursor-pointer text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearAllOptions();
                  }}
                />
                <Separator orientation="vertical" className="flex h-full min-h-6" />
                <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full mx-auto">
              <span className="mx-3 text-sm text-muted-foreground">{placeholder}</span>
              <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto p-0")}
        align="start"
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
      >
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList className="max-h-[unset] overflow-y-hidden">
            <CommandEmpty>No results found.</CommandEmpty>
            {showSelectAll && (
              <>
                <CommandGroup>
                  <CommandItem key="all" onSelect={toggleAll} className="cursor-pointer">
                    <div
                      className={cn(
                        "mr-1 flex h-4 w-4 items-center justify-center rounded-md border border-muted-foreground/50",
                        selectedValue.length === normalizedOptions.length
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-muted-foreground">Select All</span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            <CommandGroup className="max-h-[20rem] min-h-[10rem] overflow-y-auto">
              {normalizedOptions.map((option) => {
                const isSelected = selectedValue.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onOptionSelect(option.value)}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-1 flex h-4 w-4 items-center justify-center rounded-md border border-muted-foreground/50",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                    </div>
                    {option.icon && <option.icon className="w-4 h-4 mr-2 text-muted-foreground" />}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <div className="flex items-center justify-between">
                {selectedValue.length > 0 && (
                  <>
                    <CommandItem
                      onSelect={onClearAllOptions}
                      className="justify-center flex-1 cursor-pointer"
                    >
                      Clear
                    </CommandItem>
                    <Separator orientation="vertical" className="flex h-full min-h-6" />
                  </>
                )}
                <CommandItem
                  onSelect={() => setIsPopoverOpen(false)}
                  className="justify-center flex-1 max-w-full cursor-pointer"
                >
                  Close
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// For backward compatibility with the InputMultiSelect API
export const InputMultiSelect = React.forwardRef<
  HTMLDivElement,
  {
    options: SelectOption[];
    value: string[];
    onValueChange: (v: string[]) => void;
    placeholder?: string;
    truncateCount?: number;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children: (v: any) => React.ReactNode;
  }
>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select...",
      truncateCount = 3,
      disabled = false,
      className,
      style,
      children,
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = React.useState<string[]>(value);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const onOptionSelect = (option: string) => {
      const newSelectedValues = selectedValue.includes(option)
        ? selectedValue.filter((value) => value !== option)
        : [...selectedValue, option];
      setSelectedValue(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const onClearAllOptions = () => {
      setSelectedValue([]);
      onValueChange([]);
    };

    const provided = {
      options,
      onValueChange,
      placeholder,
      truncateCount,
      disabled,
      selectedValue,
      setSelectedValue,
      isPopoverOpen,
      setIsPopoverOpen,
      onOptionSelect,
      onClearAllOptions,
    };

    return (
      <div ref={ref} className={className} style={style}>
        <MultiSelect
          options={options}
          value={value}
          onChange={onValueChange}
          placeholder={placeholder}
          truncateCount={truncateCount}
          disabled={disabled}
          renderOption={(option) => children && children({ ...provided, option })}
        />
      </div>
    );
  }
);

InputMultiSelect.displayName = "InputMultiSelect";

// Export the original trigger component for backward compatibility
export const InputMultiSelectTrigger = React.forwardRef<
  HTMLButtonElement,
  any
>((props, ref) => {
  return <Button ref={ref} {...props} />;
});

InputMultiSelectTrigger.displayName = "InputMultiSelectTrigger";