"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X, Search, Check, Loader2 } from "lucide-react";
import Checkbox from "@/components/UI/Checkbox";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string | string[] | null;
  placeholder?: string;
  label?: React.ReactNode;

  onChange?: (value: string | string[] | null) => void;
  onOpen?: () => void;
  onClose?: () => void;

  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  disabled?: boolean;
  loading?: boolean;

  hasError?: boolean;
  errorMessage?: string;

  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  showSelectAll?: boolean;
  clearable?: boolean;
  maxTagCount?: number;

  helperText?: string;
  className?: string;
  fullWidth?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = "Select...",
  label,
  onChange,
  onOpen,
  onClose,
  size = "md",
  leftIcon,
  rightIcon,
  disabled = false,
  loading = false,
  hasError = false,
  errorMessage,
  multiple = false,
  searchable = false,
  searchPlaceholder = "Search...",
  showSelectAll = false,
  clearable = false,
  maxTagCount = 3,
  helperText,
  className = "",
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Positioning state
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update position logic
  const updatePosition = () => {
    if (!dropdownRef.current || !isOpen) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuHeight = 300; // Approximate max height

    let newTop = rect.bottom + window.scrollY + 4;
    let newPlacement: "bottom" | "top" = "bottom";

    // Flip to top if not enough space below and more space above
    if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
      newTop = rect.top + window.scrollY - 4;
      newPlacement = "top";
    }

    setCoords({
      top: newTop,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
    setPlacement(newPlacement);
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, { capture: true });
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, { capture: true });
    };
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Check trigger ref
      if (dropdownRef.current?.contains(target)) {
        return;
      }
      // Check menu ref (in portal)
      if (menuRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
      onClose?.();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Size classes
  const sizeClasses: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  // Filter options based on search
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : options;

  // Get selected values as array
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (disabled) return;

    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(newValues.length > 0 ? newValues : null);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
      onClose?.();
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onChange?.(options.map((opt) => opt.value));
    } else {
      onChange?.(null);
    }
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (disabled) return;
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  // Get display text
  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;

    if (multiple) {
      const selectedLabels = options
        .filter((opt) => selectedValues.includes(opt.value))
        .map((opt) => opt.label);

      if (selectedLabels.length > maxTagCount) {
        return `${selectedLabels.slice(0, maxTagCount).join(", ")} +${
          selectedLabels.length - maxTagCount
        }`;
      }
      return selectedLabels.join(", ");
    }

    return options.find((opt) => opt.value === value)?.label || placeholder;
  };

  // Label classes
  const labelClasses = [
    "block text-sm font-medium mb-1",
    hasError ? "text-red-600" : "text-forest-900",
    disabled ? "opacity-50" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Trigger button classes
  const triggerClasses = [
    "w-full flex items-center justify-between gap-2 border-2 rounded-md transition-all duration-200 cursor-pointer text-left",
    sizeClasses[size],
    hasError
      ? "border-red-500 focus:ring-2 focus:ring-red-500"
      : isOpen
        ? "border-forest-700 ring-2 ring-forest-700"
        : "border-forest-300 hover:border-forest-700",
    disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "bg-white",
    selectedValues.length > 0 ? "text-forest-950" : "text-forest-300",
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const helperTextClasses = [
    "text-xs mt-1",
    hasError ? "text-red-600" : "text-forest-700",
  ]
    .filter(Boolean)
    .join(" ");

  // Dropdown Menu Context
  const dropdownMenu = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: placement === "bottom" ? -10 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: placement === "bottom" ? -10 : 10 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "absolute",
            top: coords.top,
            left: coords.left,
            width: coords.width,
            transformOrigin: placement === "bottom" ? "top" : "bottom",
            translateY: placement === "top" ? "-100%" : "0",
          }}
          className="z-[9999] bg-white border-2 border-forest-300 rounded-md shadow-lg flex flex-col max-h-[300px]"
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-forest-300 flex-shrink-0 bg-white">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-700"
                />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-forest-300 rounded focus:outline-none focus:ring-2 focus:ring-forest-700 text-forest-950"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Select All */}
          {multiple && showSelectAll && (
            <div className="px-3 py-2 border-b border-forest-300 bg-forest-50/30 flex-shrink-0">
              <Checkbox
                label="Select All"
                checked={
                  selectedValues.length === options.length && options.length > 0
                }
                indeterminate={
                  selectedValues.length > 0 &&
                  selectedValues.length < options.length
                }
                onChange={handleSelectAll}
                size="sm"
                className="w-full"
              />
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto flex-1 py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-forest-700">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);

                return (
                  <div
                    key={option.value}
                    className={`px-3 py-2 cursor-pointer transition-colors mx-1 rounded-sm ${
                      option.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-forest-50"
                    } ${!multiple && isSelected ? "bg-forest-100" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!option.disabled) handleSelect(option.value);
                    }}
                  >
                    {multiple ? (
                      <div className="pointer-events-none">
                        <Checkbox
                          checked={isSelected}
                          label={option.label}
                          disabled={option.disabled}
                          size="sm"
                          onChange={() => {}}
                          className="w-full pointer-events-none"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {option.icon && (
                          <span className="text-forest-700">{option.icon}</span>
                        )}
                        <span
                          className={`text-sm ${
                            isSelected
                              ? "font-medium text-forest-950"
                              : "text-forest-800"
                          }`}
                        >
                          {option.label}
                        </span>
                        {isSelected && (
                          <Check
                            size={16}
                            className="text-forest-700 ml-auto"
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`} ref={dropdownRef}>
      {label && <label className={labelClasses}>{label}</label>}

      {/* Trigger Button */}
      <div className={triggerClasses} onClick={toggleDropdown}>
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          {leftIcon && (
            <span className="text-forest-700 flex-shrink-0">{leftIcon}</span>
          )}
          <span className="truncate block">{getDisplayText()}</span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {loading && (
            <Loader2 size={16} className="animate-spin text-forest-700" />
          )}
          {clearable && selectedValues.length > 0 && !disabled && (
            <div
              className="p-0.5 hover:bg-forest-100 rounded-full transition-colors"
              onClick={handleClear}
            >
              <X size={14} className="text-forest-700" />
            </div>
          )}
          {rightIcon ? (
            <span className="text-forest-700">{rightIcon}</span>
          ) : (
            <ChevronDown
              size={16}
              className={`text-forest-700 transition-transform duration-200 flex-shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {/* Helper Text / Error Message */}
      {(helperText || errorMessage) && (
        <p className={helperTextClasses}>{errorMessage || helperText}</p>
      )}

      {/* Portal for Menu */}
      {mounted && createPortal(dropdownMenu, document.body)}
    </div>
  );
};

export default Dropdown;
