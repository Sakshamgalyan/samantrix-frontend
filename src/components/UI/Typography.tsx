import React from "react";

export interface TypographyProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body1"
    | "body2"
    | "label"
    | "small";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  align?: "left" | "center" | "right" | "justify";
  size?: string;
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  textColor?: string;
  bgColor?: string;
  className?: string;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = "body1",
  weight = "normal",
  align = "left",
  size,
  margin = "none",
  textColor,
  bgColor,
  className = "",
  children,
}) => {
  // Variant styles with forest color scheme defaults
  const variantClasses: Record<string, string> = {
    h1: "text-4xl font-bold text-forest-950",
    h2: "text-3xl font-semibold text-forest-950",
    h3: "text-2xl font-semibold text-forest-900",
    h4: "text-xl font-medium text-forest-900",
    h5: "text-lg font-medium text-forest-800",
    h6: "text-base font-medium text-forest-800",
    body1: "text-base text-forest-800",
    body2: "text-sm text-forest-700",
    label: "text-sm font-medium text-forest-900",
    small: "text-xs text-forest-700",
  };

  // Weight styles
  const weightClasses: Record<string, string> = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  // Alignment styles
  const alignClasses: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  // Margin styles
  const marginClasses: Record<string, string> = {
    none: "m-0",
    xs: "mb-1",
    sm: "mb-2",
    md: "mb-4",
    lg: "mb-6",
    xl: "mb-8",
  };

  // Get HTML element based on variant
  const getElement = () => {
    if (variant.startsWith("h")) return variant;
    if (variant === "label") return "label";
    if (variant === "small") return "small";
    return "p";
  };

  // Build class string
  const baseClasses = variantClasses[variant];
  const classes = [
    baseClasses,
    weightClasses[weight],
    alignClasses[align],
    marginClasses[margin],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Build inline styles
  const inlineStyles: React.CSSProperties = {
    ...(size && { fontSize: size }),
    ...(textColor && { color: textColor }),
    ...(bgColor && { backgroundColor: bgColor }),
  };

  return React.createElement(
    getElement(),
    { className: classes, style: inlineStyles },
    children,
  );
};

export default Typography;
