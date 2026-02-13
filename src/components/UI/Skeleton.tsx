export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the skeleton */
  variant?: "circle" | "rectangular" | "rounded" | "text";
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Animation type */
  animation?: "pulse" | "none";
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rounded",
  width,
  height,
  animation = "pulse",
  className = "",
  style,
  ...props
}) => {
  // Base classes
  const baseClasses = "bg-forest-100/80";

  // Variant styles
  const variantClasses = {
    circle: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-md",
    text: "rounded-sm mt-1 mb-1 h-4 w-full", // Text mimics a line of text
  };

  // Animation styles
  const animationClass = animation === "pulse" ? "animate-pulse" : "";

  return (
    <div
      className={`
                ${baseClasses}
                ${variantClasses[variant]}
                ${animationClass}
                ${className}
            `}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      {...props}
    />
  );
};

export default Skeleton;
