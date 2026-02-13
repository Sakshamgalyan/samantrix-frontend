"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isAfter,
  isBefore,
  isValid,
  parse,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type DatePickerSize = "sm" | "md" | "lg";
export type DatePickerVariant = "default" | "outline" | "ghost";
export type DatePickerPlacement = "top" | "bottom";
export type DatePickerAlign = "left" | "right";

export interface DatePreset {
  label: string;
  getValue: () => Date;
}

export interface DatePickerProps {
  // Value
  value?: Date | null;
  onChange?: (date: Date | null) => void;

  // Display
  placeholder?: string;
  dateFormat?: string; // e.g., 'MM/dd/yyyy'
  label?: ReactNode;
  helperText?: ReactNode;

  // Appearance
  size?: DatePickerSize;
  variant?: DatePickerVariant;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  // Configuration
  showTime?: boolean; // Not implemented in this version, kept for interface compatibility
  showPresets?: boolean;
  presets?: DatePreset[];
  minDate?: Date;
  maxDate?: Date;
  disableFutureDates?: boolean;
  firstDayOfWeek?: 0 | 1; // 0 = Sunday, 1 = Monday

  // States
  disabled?: boolean;
  hasError?: boolean;

  // Behavior
  onOpen?: () => void;
  onClose?: () => void;
  onApply?: (date: Date | null) => void;
  onCancel?: () => void;

  // Portal/Positioning
  usePortal?: boolean;
  placement?: DatePickerPlacement;
  align?: DatePickerAlign;
  zIndex?: number;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  dateFormat = "MMM dd, yyyy",
  label,
  helperText,
  size = "md",
  variant = "default",
  className = "",
  leftIcon,
  rightIcon,
  showTime = false,
  showPresets = false,
  presets = [],
  minDate,
  maxDate,
  disableFutureDates = false,
  firstDayOfWeek = 0,
  disabled = false,
  hasError = false,
  onOpen,
  onClose,
  usePortal = true,
  placement = "bottom",
  align = "left",
  zIndex = 9999,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);

  // update internal state if prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedDate(value);
      if (value && isValid(value)) {
        setCurrentMonth(value);
      }
    }
  }, [value]);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [actualPlacement, setActualPlacement] =
    useState<DatePickerPlacement>(placement);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Positioning logic (similar to Dropdown)
  const updatePosition = () => {
    if (!containerRef.current || !isOpen) return;

    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuHeight = 350; // approximate

    let newTop = rect.bottom + window.scrollY + 4;
    let newPlacement: DatePickerPlacement = "bottom";

    // Flip logic
    if (
      placement === "bottom" &&
      spaceBelow < menuHeight &&
      spaceAbove > spaceBelow
    ) {
      newTop = rect.top + window.scrollY - 4;
      newPlacement = "top";
    } else if (
      placement === "top" &&
      spaceAbove < menuHeight &&
      spaceBelow > spaceAbove
    ) {
      newTop = rect.bottom + window.scrollY + 4;
      newPlacement = "bottom";
    } else if (placement === "top") {
      newTop = rect.top + window.scrollY - 4;
      newPlacement = "top";
    }

    setCoords({
      top: newTop,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
    setActualPlacement(newPlacement);
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

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;

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

  const toggleOpen = () => {
    if (disabled) return;
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) {
      onOpen?.();
      if (selectedDate) setCurrentMonth(selectedDate);
    } else {
      onClose?.();
    }
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;

    setSelectedDate(date);
    onChange?.(date);

    // Auto close on select
    setIsOpen(false);
    onClose?.();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(null);
    onChange?.(null);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Date Helpers
  const isDateDisabled = (date: Date) => {
    if (disableFutureDates && isAfter(date, new Date())) return true;
    if (minDate && isBefore(date, minDate) && !isSameDay(date, minDate))
      return true;
    if (maxDate && isAfter(date, maxDate) && !isSameDay(date, maxDate))
      return true;
    return false;
  };

  // Calendar Grid Generation
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: firstDayOfWeek });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: firstDayOfWeek });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = eachDayOfInterval({
    start: startDate,
    end: endOfWeek(startDate, { weekStartsOn: firstDayOfWeek }),
  });

  // Styles
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const triggerClasses = [
    "w-full flex items-center justify-between gap-2 border-2 rounded-md transition-all duration-200 cursor-pointer text-left bg-white",
    sizeClasses[size],
    hasError
      ? "border-red-500 focus:ring-2 focus:ring-red-500"
      : isOpen
        ? "border-forest-700 ring-2 ring-forest-700"
        : "border-forest-300 hover:border-forest-700",
    disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const popupContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: actualPlacement === "bottom" ? -10 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: actualPlacement === "bottom" ? -10 : 10 }}
          transition={{ duration: 0.15 }}
          style={{
            position: usePortal ? "absolute" : "absolute",
            top: usePortal ? coords.top : "100%",
            left: usePortal ? coords.left : 0,
            zIndex: zIndex,
            translateY: actualPlacement === "top" ? "-100%" : "0",
          }}
          className="bg-white border-2 border-forest-300 rounded-lg shadow-xl p-4 w-[320px] max-w-[90vw]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-forest-50 rounded-full text-forest-700"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-forest-900">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-forest-50 rounded-full text-forest-700"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day) => (
              <div
                key={day.toString()}
                className="text-center text-xs font-bold text-forest-500 uppercase tracking-wider h-8 flex items-center justify-center"
              >
                {format(day, "EEEEE")}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isDisabled = isDateDisabled(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={day.toString()}
                  onClick={() => handleDateSelect(day)}
                  disabled={isDisabled}
                  className={`
                                        h-9 w-9 rounded-full flex items-center justify-center text-sm transition-colors relative
                                        ${!isCurrentMonth ? "text-gray-300" : "text-forest-900"}
                                        ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-forest-100"}
                                        ${isSelected ? "bg-forest-700 text-white hover:bg-forest-800 font-medium shadow-md" : ""}
                                        ${isTodayDate && !isSelected ? "border border-forest-300 font-semibold" : ""}
                                    `}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          {/* Presets */}
          {showPresets && presets && presets.length > 0 && (
            <div className="mt-4 pt-4 border-t border-forest-100 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleDateSelect(preset.getValue())}
                  className="px-2 py-1 bg-forest-50 text-xs text-forest-700 rounded hover:bg-forest-100 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {/* Clear / Today */}
          <div className="mt-3 pt-3 border-t border-forest-100 flex justify-between">
            <button
              onClick={(e) => {
                handleDateSelect(new Date());
              }}
              className="text-xs font-medium text-forest-600 hover:text-forest-800 flex items-center gap-1"
            >
              Today
            </button>
            <button
              onClick={handleClear}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      className={`relative ${usePortal ? "" : "inline-block w-full"}`}
      ref={containerRef}
    >
      {label && (
        <label
          className={`block text-sm font-medium mb-1 ${hasError ? "text-red-600" : "text-forest-900"}`}
        >
          {label}
        </label>
      )}

      <div className={triggerClasses} onClick={toggleOpen}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-forest-700 flex-shrink-0">
            {leftIcon || <CalendarIcon size={18} />}
          </span>
          <span
            className={`block truncate ${!selectedDate ? "text-forest-300" : "text-forest-950"}`}
          >
            {selectedDate ? format(selectedDate, dateFormat) : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {selectedDate && !disabled && (
            <div
              className="p-1 hover:bg-forest-100 rounded-full text-forest-500 mr-1"
              onClick={handleClear}
            >
              <X size={14} />
            </div>
          )}
          {rightIcon}
        </div>
      </div>

      {(helperText || hasError) && (
        <p
          className={`text-xs mt-1 ${hasError ? "text-red-600" : "text-forest-700"}`}
        >
          {helperText}
        </p>
      )}

      {usePortal && mounted
        ? createPortal(popupContent, document.body)
        : popupContent}
    </div>
  );
};

export default DatePicker;
