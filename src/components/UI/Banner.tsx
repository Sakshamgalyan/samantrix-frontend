import { useState, useEffect } from "react";
import {
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  X,
  HelpCircle,
} from "lucide-react";

export type BannerVariant =
  | "info"
  | "warning"
  | "error"
  | "success"
  | "neutral";
export type BannerStyle = "solid" | "border" | "subtle";
export type BannerSize = "sm" | "md" | "lg";

export interface BannerProps {
  /** The type of banner to display */
  variant?: BannerVariant;
  /** Visual style of the banner */
  bannerstyle?: BannerStyle;
  /** Main title text */
  title?: string;
  /** Secondary description text */
  description?: string;
  /** Size of the banner padding and text */
  size?: BannerSize;
  /** Custom icon to override default based on variant. Pass null to hide icon. */
  icon?: React.ReactNode | null;
  /** Action button or element to display */
  button?: React.ReactNode;
  /** Whether the banner takes full width (removes rounded corners) */
  fullwidth?: boolean;
  /** Whether the banner can be dismissed */
  dismissible?: boolean;
  /** Callback when banner is dismissed */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}

const variantStyles: Record<
  BannerVariant,
  {
    solid: string;
    subtle: string;
    border: string;
    icon: React.ElementType;
    iconColor: string;
  }
> = {
  info: {
    solid: "bg-blue-600 text-white border-transparent",
    subtle: "bg-blue-50 text-blue-900 border-transparent",
    border: "bg-blue-50 text-blue-900 border-blue-200",
    icon: Info,
    iconColor: "text-blue-600",
  },
  warning: {
    solid: "bg-amber-500 text-white border-transparent",
    subtle: "bg-amber-50 text-amber-900 border-transparent",
    border: "bg-amber-50 text-amber-900 border-amber-200",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
  },
  error: {
    solid: "bg-red-600 text-white border-transparent",
    subtle: "bg-red-50 text-red-900 border-transparent",
    border: "bg-red-50 text-red-900 border-red-200",
    icon: AlertCircle,
    iconColor: "text-red-600",
  },
  success: {
    solid: "bg-forest-700 text-white border-transparent",
    subtle: "bg-forest-50 text-forest-900 border-transparent",
    border: "bg-forest-50 text-forest-900 border-forest-300",
    icon: CheckCircle,
    iconColor: "text-forest-700",
  },
  neutral: {
    solid: "bg-gray-800 text-white border-transparent",
    subtle: "bg-gray-100 text-gray-900 border-transparent",
    border: "bg-white text-gray-900 border-gray-200",
    icon: HelpCircle,
    iconColor: "text-gray-600",
  },
};

const sizeStyles: Record<BannerSize, string> = {
  sm: "py-2 px-3 text-sm",
  md: "py-3 px-4 text-base",
  lg: "py-4 px-6 text-lg",
};

const Banner: React.FC<BannerProps> = ({
  variant = "info",
  bannerstyle = "subtle",
  title,
  description,
  size = "md",
  icon,
  button,
  fullwidth = false,
  dismissible = false,
  onDismiss,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const styles = variantStyles[variant];
  const VariantIcon = styles.icon;

  // Determine classes based on style prop
  let baseClasses = styles[bannerstyle];

  // Override icon color for solid style (usually white)
  const iconColorClass =
    bannerstyle === "solid" ? "text-white/90" : styles.iconColor;
  const closeButtonClass =
    bannerstyle === "solid"
      ? "text-white/70 hover:text-white hover:bg-white/20"
      : "text-gray-500 hover:text-gray-900 hover:bg-black/5";

  return (
    <div
      role="alert"
      className={`
                flex items-start gap-3 border transition-all duration-200
                ${sizeStyles[size]}
                ${fullwidth ? "w-full rounded-none border-x-0" : "rounded-lg"}
                ${baseClasses}
                ${className}
            `}
    >
      {/* Icon */}
      {icon !== null && (
        <div className={`flex-shrink-0 mt-0.5 ${iconColorClass}`}>
          {icon || (
            <VariantIcon size={size === "lg" ? 24 : size === "sm" ? 16 : 20} />
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3
            className={`font-semibold leading-tight ${description ? "mb-1" : ""}`}
          >
            {title}
          </h3>
        )}
        {description && (
          <div
            className={`opacity-90 leading-relaxed ${!title ? "font-medium" : ""}`}
          >
            {description}
          </div>
        )}
        {button && <div className="mt-3">{button}</div>}
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={`flex-shrink-0 p-1 rounded-full transition-colors ${closeButtonClass}`}
          aria-label="Dismiss"
        >
          <X size={size === "lg" ? 24 : 18} />
        </button>
      )}
    </div>
  );
};

export default Banner;
