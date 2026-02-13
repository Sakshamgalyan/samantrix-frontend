import { Loader2 } from "lucide-react";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "circle" | "dots" | "pulse";
export type SpinnerSpeed = "slow" | "normal" | "fast";

export interface SpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Visual style of the spinner */
  variant?: SpinnerVariant;
  /** Animation speed */
  speed?: SpinnerSpeed;
  /** Optional label to display below the spinner */
  label?: string;
  /** Whether to center the spinner in its container */
  centered?: boolean;
  /** Whether to show as a full-screen overlay */
  fullscreen?: boolean;
  /** Thickness of the spinner ring (only for 'circle' variant) */
  thickness?: number;
  /** Accessibility label */
  ariaLabel?: string;
  /** Additional custom classes */
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: "w-3 h-3 text-xs",
  sm: "w-4 h-4 text-sm",
  md: "w-6 h-6 text-base",
  lg: "w-8 h-8 text-lg",
  xl: "w-12 h-12 text-xl",
};

const speedClasses: Record<SpinnerSpeed, string> = {
  slow: "animate-spin duration-1000", // Tailwind's animate-spin is fixed speed usually, might need custom style or config
  normal: "animate-spin",
  fast: "animate-spin duration-300",
};

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "circle",
  speed = "normal",
  thickness = 2,
  label,
  centered = false,
  fullscreen = false,
  ariaLabel = "Loading",
  className = "",
}) => {
  // Size Logic
  const sizeClass = sizeClasses[size];

  // Layout Logic
  const containerClasses = [
    "flex flex-col items-center justify-center gap-2",
    centered ? "w-full h-full min-h-[100px]" : "",
    fullscreen ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Custom pulse/dots variants if needed, but for now relying on Lucide Loader2 for 'circle'
  // For dots/pulse we might need custom CSS/divs.

  const renderSpinner = () => {
    if (variant === "circle") {
      return (
        <Loader2
          className={`${sizeClass} ${speed === "slow" ? "animate-[spin_3s_linear_infinite]" : speed === "fast" ? "animate-[spin_0.5s_linear_infinite]" : "animate-spin"} text-forest-600`}
          strokeWidth={thickness}
          aria-label={ariaLabel}
        />
      );
    }

    if (variant === "dots") {
      return (
        <div
          className={`flex space-x-1 ${size === "xs" || size === "sm" ? "scale-75" : ""}`}
          aria-label={ariaLabel}
        >
          <div className="w-2 h-2 bg-forest-600 rounded-full animate-[bounce_1s_infinite_0s]"></div>
          <div className="w-2 h-2 bg-forest-600 rounded-full animate-[bounce_1s_infinite_0.1s]"></div>
          <div className="w-2 h-2 bg-forest-600 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
        </div>
      );
    }

    if (variant === "pulse") {
      return (
        <span className={`relative flex ${sizeClass}`}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-full w-full bg-forest-600"></span>
        </span>
      );
    }

    return null;
  };

  if (fullscreen) {
    // Simple portal-like behavior for fullscreen (or rely on usage to place it at root)
    // Ideally should use createPortal for fullscreen to be safe, but CSS fixed works mostly.
    return (
      <div className={containerClasses}>
        {renderSpinner()}
        {label && (
          <span className="text-forest-700 font-medium animate-pulse">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {renderSpinner()}
      {label && <span className="text-forest-600 text-sm">{label}</span>}
    </div>
  );
};

export default Spinner;
