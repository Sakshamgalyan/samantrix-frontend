"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 200,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined); // Explicitly type as NodeJS.Timeout | undefined

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      let top = 0;
      let left = 0;

      // Basic positioning logic
      // Note: This is a simplified version. For production-grade, use floating-ui.
      switch (position) {
        case "top":
          top = rect.top + scrollY - 10; // 10px offset
          left = rect.left + scrollX + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + scrollY + 10;
          left = rect.left + scrollX + rect.width / 2;
          break;
        case "left":
          top = rect.top + scrollY + rect.height / 2;
          left = rect.left + scrollX - 10;
          break;
        case "right":
          top = rect.top + scrollY + rect.height / 2;
          left = rect.right + scrollX + 10;
          break;
      }

      setCoords({ top, left });
    }
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Handle scroll/resize to update position if visible
  useEffect(() => {
    if (isVisible) {
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Transform Origin for animation based on position
  const getTransformOrigin = () => {
    switch (position) {
      case "top":
        return "bottom center";
      case "bottom":
        return "top center";
      case "left":
        return "right center";
      case "right":
        return "left center";
      default:
        return "center";
    }
  };

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "absolute",
            top: coords.top,
            left: coords.left,
            transformOrigin: getTransformOrigin(),
            zIndex: 50,
          }}
          className={`
                        pointer-events-none fixed px-3 py-1.5 text-xs text-white bg-forest-900 rounded shadow-lg whitespace-nowrap z-[9999]
                        ${position === "top" ? "-translate-x-1/2 -translate-y-full" : ""}
                        ${position === "bottom" ? "-translate-x-1/2" : ""}
                        ${position === "left" ? "-translate-x-full -translate-y-1/2" : ""}
                        ${position === "right" ? "-translate-y-1/2" : ""}
                        ${className}
                    `}
        >
          {content}
          {/* Arrow */}
          <div
            className={`
                            absolute w-2 h-2 bg-forest-900 rotate-45
                            ${position === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2" : ""}
                            ${position === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2" : ""}
                            ${position === "left" ? "right-[-4px] top-1/2 -translate-y-1/2" : ""}
                            ${position === "right" ? "left-[-4px] top-1/2 -translate-y-1/2" : ""}
                        `}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block" // Ensure wrapper doesn't break layout
      >
        {children}
      </div>
      {typeof document !== "undefined" &&
        createPortal(tooltipContent, document.body)}
    </>
  );
};

export default Tooltip;
