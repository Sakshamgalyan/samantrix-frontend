"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export interface ToggleProps {
  /** current state of the toggle */
  checked: boolean;
  /** callback when state changes */
  onChange: (checked: boolean) => void;
  /** Optional label text to display next to the toggle */
  label?: string;
  /** Whether to show icons (Check/X) inside the toggle thumb */
  withIcon?: boolean;
  /** Whether to show custom icon inside the toggle thumb */
  customIcon?: React.ReactNode;
  /** disbaled state */
  isDisabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Size of the toggle */
  size?: "sm" | "md" | "lg";
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  withIcon = false,
  customIcon,
  isDisabled = false,
  className = "",
  size = "md",
}) => {
  const handleToggle = () => {
    if (!isDisabled) {
      onChange(!checked);
    }
  };

  // Size Configuration
  const sizeConfig = {
    sm: {
      container: "w-8 h-4",
      thumb: "w-3 h-3",
      translate: 16, // 32 (w) - 12 (thumb) - 4 (padding x 2) roughly
      padding: 2,
      iconSize: 8,
    },
    md: {
      container: "w-11 h-6",
      thumb: "w-5 h-5",
      translate: 20,
      padding: 2,
      iconSize: 12,
    },
    lg: {
      container: "w-14 h-8",
      thumb: "w-7 h-7",
      translate: 24,
      padding: 2,
      iconSize: 16,
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`inline-flex items-center gap-3 ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      onClick={handleToggle}
    >
      <div
        className={`
                    relative rounded-full transition-colors duration-200 ease-in-out flex items-center
                    ${config.container}
                    ${checked ? "bg-forest-600" : "bg-gray-300"}
                `}
        style={{ padding: config.padding }}
      >
        <motion.div
          className={`
                        bg-white rounded-full shadow-sm flex items-center justify-center
                        ${config.thumb}
                    `}
          animate={{
            x: checked ? config.translate : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
        >
          {/* Icons */}
          {(withIcon || customIcon) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              key={checked ? "check" : "x"}
            >
              {customIcon
                ? customIcon
                : withIcon &&
                  (checked ? (
                    <Check
                      size={config.iconSize}
                      className="text-forest-600"
                      strokeWidth={3}
                    />
                  ) : (
                    <X
                      size={config.iconSize}
                      className="text-gray-400"
                      strokeWidth={3}
                    />
                  ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {label && (
        <span
          className={`text-sm font-medium ${isDisabled ? "text-gray-400" : "text-forest-900"}`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default Toggle;
