import React from "react";
import { motion } from "framer-motion";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabProps {
  variant?: "classic" | "button" | "link" | "pill";
  size?: "xs" | "sm" | "md" | "lg";
  activeTab: string;
  items: TabItem[];
  onTabChange: (tabId: string) => void;
  fullWidth?: boolean;
  className?: string;
}

const Tab: React.FC<TabProps> = ({
  variant = "classic",
  size = "md",
  activeTab,
  items,
  onTabChange,
  fullWidth = false,
  className = "",
}) => {
  // Size styles
  const sizeClasses: Record<string, string> = {
    xs: "text-xs px-3 py-1.5",
    sm: "text-sm px-4 py-2",
    md: "text-base px-5 py-2.5",
    lg: "text-lg px-6 py-3",
  };

  // Variant styles with forest color scheme
  const getVariantClasses = (isActive: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      return "text-gray-400 cursor-not-allowed opacity-50";
    }

    const variants: Record<string, { active: string; inactive: string }> = {
      classic: {
        active: "text-forest-950 border-b-2 border-forest-700",
        inactive:
          "text-forest-700 hover:text-forest-900 border-b-2 border-transparent hover:border-forest-300",
      },
      button: {
        active: "bg-forest-800 text-forest-50",
        inactive: "bg-forest-50 text-forest-800 hover:bg-forest-300",
      },
      link: {
        active: "text-forest-950 font-semibold",
        inactive: "text-forest-700 hover:text-forest-900 hover:underline",
      },
      pill: {
        active: "bg-forest-700 text-forest-50",
        inactive: "bg-transparent text-forest-800 hover:bg-forest-50",
      },
    };

    return isActive ? variants[variant].active : variants[variant].inactive;
  };

  // Container classes
  const containerClasses = [
    "flex",
    fullWidth ? "w-full" : "",
    variant === "classic" ? "border-b border-forest-300" : "gap-2",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Tab button base classes
  const baseTabClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none";

  // Additional classes based on variant
  const variantSpecificClasses: Record<string, string> = {
    classic: "",
    button: "rounded",
    link: "",
    pill: "rounded-full",
  };

  return (
    <div className={containerClasses} role="tablist">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        const isDisabled = item.disabled || false;

        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            className={[
              baseTabClasses,
              sizeClasses[size],
              getVariantClasses(isActive, isDisabled),
              variantSpecificClasses[variant],
              fullWidth ? "flex-1" : "",
              isDisabled ? "" : "cursor-pointer",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => !isDisabled && onTabChange(item.id)}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}

            {/* Animated underline for classic variant */}
            {variant === "classic" && isActive && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest-700"
                layoutId="activeTab"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tab;
