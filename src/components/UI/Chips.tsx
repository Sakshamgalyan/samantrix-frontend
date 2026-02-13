"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { ReactNode, forwardRef } from "react";

export type ChipVariant = "filled" | "outlined" | "soft" | "ghost";
export type ChipSize = "sm" | "md" | "lg";
export type ChipColorScheme =
  | "forest"
  | "neutral"
  | "danger"
  | "warning"
  | "success";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The content of the chip */
  label: ReactNode;
  /** Visual style variant */
  variant?: ChipVariant;
  /** Size of the chip */
  size?: ChipSize;
  /** Color scheme */
  colorScheme?: ChipColorScheme;
  /** Icon to display before the label */
  icon?: ReactNode;
  /** Avatar to display before the label (circular) */
  avatar?: string;
  /** Called when the delete button is clicked */
  onDelete?: () => void;
  /** Called when the chip is clicked */
  onClick?: () => void;
  /** Whether the chip is clickable */
  clickable?: boolean;
  /** Whether the chip is currently selected/active */
  active?: boolean;
  /** Whether the chip is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      label,
      variant = "filled",
      size = "md",
      colorScheme = "forest",
      icon,
      avatar,
      onDelete,
      onClick,
      clickable = false,
      active = false,
      disabled = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    // Size configurations
    const sizeConfig = {
      sm: {
        height: "h-6",
        padding: avatar ? "pl-0.5 pr-2" : "px-2",
        fontSize: "text-xs",
        iconSize: 12,
        gap: "gap-1.5",
        avatarSize: "w-5 h-5",
      },
      md: {
        height: "h-8",
        padding: avatar ? "pl-1 pr-3" : "px-3",
        fontSize: "text-sm",
        iconSize: 14,
        gap: "gap-2",
        avatarSize: "w-6 h-6",
      },
      lg: {
        height: "h-10",
        padding: avatar ? "pl-1 pr-4" : "px-4",
        fontSize: "text-base",
        iconSize: 16,
        gap: "gap-2.5",
        avatarSize: "w-8 h-8",
      },
    };

    const config = sizeConfig[size];

    // Color Scheme Definitions
    const colors = {
      forest: {
        filled: active
          ? "bg-forest-900 text-white border-transparent"
          : "bg-forest-700 text-white border-transparent hover:bg-forest-800",
        outlined: active
          ? "bg-forest-50 border-forest-700 text-forest-800"
          : "bg-transparent border-forest-300 text-forest-700 hover:border-forest-500 hover:bg-forest-50/50",
        soft: active
          ? "bg-forest-200 text-forest-900 border-transparent"
          : "bg-forest-50 text-forest-800 border-transparent hover:bg-forest-100",
        ghost: active
          ? "bg-forest-100 text-forest-900"
          : "bg-transparent text-forest-700 hover:bg-forest-50",
      },
      neutral: {
        filled: "bg-gray-800 text-white border-transparent hover:bg-gray-900",
        outlined:
          "bg-transparent border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50",
        soft: "bg-gray-100 text-gray-800 border-transparent hover:bg-gray-200",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
      },
      danger: {
        filled: "bg-red-600 text-white border-transparent hover:bg-red-700",
        outlined:
          "bg-transparent border-red-300 text-red-600 hover:border-red-500 hover:bg-red-50",
        soft: "bg-red-50 text-red-700 border-transparent hover:bg-red-100",
        ghost: "bg-transparent text-red-600 hover:bg-red-50",
      },
      warning: {
        filled: "bg-amber-500 text-white border-transparent hover:bg-amber-600",
        outlined:
          "bg-transparent border-amber-300 text-amber-700 hover:border-amber-500 hover:bg-amber-50",
        soft: "bg-amber-50 text-amber-800 border-transparent hover:bg-amber-100",
        ghost: "bg-transparent text-amber-700 hover:bg-amber-50",
      },
      success: {
        filled: "bg-green-600 text-white border-transparent hover:bg-green-700",
        outlined:
          "bg-transparent border-green-300 text-green-600 hover:border-green-500 hover:bg-green-50",
        soft: "bg-green-50 text-green-700 border-transparent hover:bg-green-100",
        ghost: "bg-transparent text-green-600 hover:bg-green-50",
      },
    };

    const isInteractive = (onClick || clickable) && !disabled;
    const variantClasses = colors[colorScheme][variant];

    const disabledClasses = disabled
      ? "opacity-50 cursor-not-allowed pointer-events-none grayscale"
      : isInteractive
        ? "cursor-pointer"
        : "";

    // Animation variants
    const animationVariants = {
      hover: isInteractive ? { scale: 1.02 } : {},
      tap: isInteractive ? { scale: 0.95 } : {},
    };

    return (
      <motion.div
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-full border transition-colors duration-200
          ${config.height} ${config.padding} ${config.fontSize} ${config.gap}
          ${variantClasses} ${disabledClasses} ${className}
        `}
        whileHover={animationVariants.hover}
        whileTap={animationVariants.tap}
        onClick={!disabled && onClick ? onClick : undefined}
        {...(props as any)}
      >
        {/* Avatar */}
        {avatar && (
          <img
            src={avatar}
            alt="avatar"
            className={`${config.avatarSize} rounded-full object-cover border border-white/20`}
          />
        )}

        {/* Start Icon (if no avatar) */}
        {!avatar && icon && <span className="flex items-center">{icon}</span>}

        {/* Selected Checkmark */}
        {active && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center"
          >
            <Check size={config.iconSize} />
          </motion.span>
        )}

        {/* Label */}
        <span className="font-medium whitespace-nowrap">{label}</span>

        {/* Delete Button */}
        {onDelete && !disabled && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={`
              flex items-center justify-center rounded-full 
              hover:bg-black/10 transition-colors p-0.5 ml-0.5
              ${variant === "filled" ? "text-white/80 hover:text-white" : "text-current opacity-60 hover:opacity-100"}
            `}
          >
            <X size={config.iconSize} />
          </span>
        )}
      </motion.div>
    );
  },
);

Chip.displayName = "Chip";

export default Chip;
