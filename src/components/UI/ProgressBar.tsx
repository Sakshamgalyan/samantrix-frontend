"use client";

import { motion } from "framer-motion";

export type ProgressBarType = "linear" | "circular";
export type ProgressBarVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info";
export type ProgressBarSize = "sm" | "md" | "lg" | "xl";
export type LabelPosition = "top" | "bottom" | "inside" | "right" | "center";

export interface ProgressBarProps {
  /** The current value of the progress */
  value?: number;
  /** The maximum value (default 100) */
  max?: number;
  /** The minimum value (default 0) */
  min?: number;
  /** Visual type of the progress bar */
  type?: ProgressBarType;
  /** Color variant */
  variant?: ProgressBarVariant;
  /** Size of the progress bar */
  size?: ProgressBarSize;
  /** Whether to show the percentage label */
  showLabel?: boolean;
  /** Custom label text. If boolean true, shows rounded percentage. text-string allows custom override. */
  label?: string | boolean;
  /** Position of the label */
  labelPosition?: LabelPosition;
  /** Whether the progress is indeterminate (loading without known end) */
  isIndeterminate?: boolean;
  /** Whether to show stripe animation */
  isAnimated?: boolean;
  /** Additional class names */
  className?: string;
  /** Custom color string to override variant */
  color?: string;
}

const variantColors: Record<ProgressBarVariant, string> = {
  default: "bg-forest-600",
  success: "bg-forest-600", // Using forest for success/default preference
  warning: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

const sizeHeights: Record<ProgressBarSize, string> = {
  sm: "h-1.5 text-xs",
  md: "h-2.5 text-sm",
  lg: "h-4 text-base",
  xl: "h-6 text-lg",
};

const circleSizes: Record<ProgressBarSize, number> = {
  sm: 40,
  md: 80,
  lg: 120,
  xl: 160,
};

const strokeWidths: Record<ProgressBarSize, number> = {
  sm: 3,
  md: 6,
  lg: 8,
  xl: 10,
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  max = 100,
  min = 0,
  type = "linear",
  variant = "default",
  size = "md",
  showLabel = false,
  label,
  labelPosition = "top",
  isIndeterminate = false,
  isAnimated = false,
  className = "",
  color,
}) => {
  // Normalization
  const percentage = Math.min(
    100,
    Math.max(0, ((value - min) / (max - min)) * 100),
  );

  // Label Content
  const labelContent =
    typeof label === "string" ? label : `${Math.round(percentage)}%`;
  const shouldShowLabel = showLabel || !!label;

  // Colors
  const progressColor = color ? `bg-[${color}]` : variantColors[variant];
  // Tailwind specific hack for dynamic colors if color prop is passed, ideally use style for arbitrary values
  const progressStyle = color ? { backgroundColor: color } : {};

  // Linear Progress Bar
  if (type === "linear") {
    const heightClass = sizeHeights[size];

    return (
      <div className={`w-full ${className}`}>
        {/* Top Label */}
        {shouldShowLabel && labelPosition === "top" && (
          <div className="flex justify-between mb-1 text-sm font-medium text-forest-700">
            <span>{labelContent}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div
            className={`w-full bg-forest-100 rounded-full overflow-hidden ${heightClass.split(" ")[0]}`}
          >
            <motion.div
              className={`h-full rounded-full flex items-center justify-center text-xs font-medium text-white transition-all ${!color && progressColor}`}
              style={{
                ...progressStyle,
                width: isIndeterminate ? "100%" : `${percentage}%`,
              }}
              initial={{ width: 0 }}
              animate={{
                width: isIndeterminate ? "100%" : `${percentage}%`,
                x: isIndeterminate ? ["-100%", "100%"] : 0,
              }}
              transition={
                isIndeterminate
                  ? {
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }
                  : {
                      duration: 0.5,
                      ease: "easeOut",
                    }
              }
            >
              {/* Animated Stripes */}
              {isAnimated && !isIndeterminate && (
                <motion.div
                  className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"
                  animate={{ backgroundPosition: ["0rem 0", "1rem 0"] }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
              )}
              {/* Inside Label */}
              {shouldShowLabel &&
                labelPosition === "inside" &&
                size !== "sm" &&
                !isIndeterminate && (
                  <span className="px-2 drop-shadow-sm">{labelContent}</span>
                )}
            </motion.div>
          </div>

          {/* Right Label */}
          {shouldShowLabel && labelPosition === "right" && (
            <span className="text-sm font-medium text-forest-700 min-w-[3ch]">
              {labelContent}
            </span>
          )}
        </div>

        {/* Bottom Label */}
        {shouldShowLabel && labelPosition === "bottom" && (
          <div className="flex justify-between mt-1 text-xs font-medium text-forest-600">
            <span>{labelContent}</span>
          </div>
        )}
      </div>
    );
  }

  // Circular Progress Bar
  if (type === "circular") {
    const circleSize = circleSizes[size];
    const strokeWidth = strokeWidths[size];
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div
        className={`relative flex items-center justify-center ${className}`}
        style={{ width: circleSize, height: circleSize }}
      >
        <svg className="transform -rotate-90 w-full h-full">
          {/* Track */}
          <circle
            className="text-forest-100"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={circleSize / 2}
            cy={circleSize / 2}
          />
          {/* Indicator */}
          <motion.circle
            className={`${!color && (variant === "default" || variant === "success" ? "text-forest-600" : variant === "error" ? "text-red-500" : variant === "warning" ? "text-amber-500" : "text-blue-500")}`}
            style={{
              color: color,
              strokeLinecap: "round",
            }}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={isIndeterminate ? circumference * 0.25 : offset}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={circleSize / 2}
            cy={circleSize / 2}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: isIndeterminate ? circumference * 0.25 : offset,
              rotate: isIndeterminate ? 360 : 0,
            }}
            transition={
              isIndeterminate
                ? {
                    rotate: { repeat: Infinity, duration: 1.5, ease: "linear" },
                  }
                : {
                    duration: 0.5,
                    ease: "easeOut",
                  }
            }
          />
        </svg>
        {/* Center Label */}
        {(shouldShowLabel || labelPosition === "center") &&
          !isIndeterminate && (
            <div className="absolute text-forest-700 font-semibold text-sm">
              {labelContent}
            </div>
          )}
      </div>
    );
  }

  return null;
};

export default ProgressBar;
