"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

export type CardShadow = "none" | "sm" | "md" | "lg" | "xl";
export type CardRadius =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

export interface CardProps {
  /** Visual variant of the card */
  variant?:
    | "default"
    | "outlined"
    | "elevated"
    | "filled"
    | "gradient"
    | "glass";
  /** Padding size */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Shadow depth */
  shadow?: CardShadow;
  /** Enable hover effects */
  hoverEffect?: boolean;
  /** Border radius */
  radius?: CardRadius;
  /** Card header/title */
  header?: ReactNode;
  /** Card footer */
  footer?: ReactNode;
  /** Custom background color */
  bgColor?: string;
  /** Show border */
  border?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Card content */
  children: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Clickable/hoverable state */
  isClickable?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Image URL for card header */
  imageUrl?: string;
  /** Image alt text */
  imageAlt?: string;
}

const Card = ({
  variant = "default",
  padding = "md",
  shadow = "sm",
  hoverEffect = false,
  radius = "lg",
  header,
  footer,
  bgColor,
  border = true,
  isLoading = false,
  className = "",
  children,
  onClick,
  isClickable = false,
  disabled = false,
  imageUrl,
  imageAlt = "Card image",
}: CardProps) => {
  // Padding classes
  const paddingClasses = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  // Shadow classes
  const shadowClasses = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  // Radius classes
  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };

  // Variant styles
  const getVariantClasses = () => {
    if (disabled) {
      return "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed";
    }

    const baseClasses = "transition-all duration-200";

    switch (variant) {
      case "outlined":
        return `${baseClasses} bg-white border-2 border-forest-300 ${
          hoverEffect ? "hover:border-forest-700 hover:shadow-md" : ""
        }`;
      case "elevated":
        return `${baseClasses} bg-white border border-forest-200 shadow-lg ${
          hoverEffect ? "hover:shadow-xl hover:-translate-y-1" : ""
        }`;
      case "filled":
        return `${baseClasses} bg-forest-50 border border-forest-300 ${
          hoverEffect ? "hover:bg-forest-100 hover:shadow-md" : ""
        }`;
      case "gradient":
        return `${baseClasses} bg-gradient-to-br from-forest-50 to-white border border-forest-300 ${
          hoverEffect
            ? "hover:from-forest-100 hover:to-forest-50 hover:shadow-lg"
            : ""
        }`;
      case "glass":
        return `${baseClasses} bg-white/80 backdrop-blur-sm border border-forest-200 ${
          hoverEffect ? "hover:bg-white/90 hover:shadow-lg" : ""
        }`;
      case "default":
      default:
        return `${baseClasses} bg-white ${border ? "border border-forest-200" : ""} ${
          hoverEffect ? "hover:shadow-md" : ""
        }`;
    }
  };

  const cardClasses = `
    ${radiusClasses[radius]}
    ${shadowClasses[shadow]}
    ${getVariantClasses()}
    ${isClickable || onClick ? "cursor-pointer" : ""}
    ${className}
    overflow-hidden
  `.trim();

  const contentClasses = paddingClasses[padding];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cardClasses}>
        <div className={contentClasses}>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-forest-200 rounded w-3/4"></div>
            <div className="h-4 bg-forest-200 rounded w-1/2"></div>
            <div className="h-4 bg-forest-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const CardWrapper = onClick || isClickable ? motion.div : "div";
  const motionProps =
    onClick || isClickable
      ? {
          whileHover: !disabled ? { scale: 1.02 } : {},
          whileTap: !disabled ? { scale: 0.98 } : {},
        }
      : {};

  return (
    <CardWrapper
      className={cardClasses}
      onClick={!disabled ? onClick : undefined}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
      {...motionProps}
    >
      {/* Image Header */}
      {imageUrl && (
        <div className="w-full">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Header */}
      {header && (
        <div
          className={`border-b border-forest-200 ${paddingClasses[padding]}`}
        >
          {typeof header === "string" ? (
            <h3 className="text-lg font-semibold text-forest-950">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}

      {/* Content */}
      <div className={contentClasses}>{children}</div>

      {/* Footer */}
      {footer && (
        <div
          className={`border-t border-forest-200 ${paddingClasses[padding]} bg-forest-50/50`}
        >
          {footer}
        </div>
      )}
    </CardWrapper>
  );
};

export default Card;
