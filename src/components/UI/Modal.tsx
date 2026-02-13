"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full" | "auto";
export type ModalPosition = "center" | "top" | "bottom";
export type ModalVariant = "default" | "fullscreen" | "panel";

export interface ModalProps {
  /** Controls visibility */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Modal size preset */
  size?: ModalSize;
  /** Screen position */
  position?: ModalPosition;
  /** Layout variant */
  variant?: ModalVariant;
  /** Header Title */
  title?: React.ReactNode;
  /** Header Subtitle */
  subtitle?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Show the X close button in header */
  showCloseButton?: boolean;
  /** Whether the modal can be closed (by backdrop/esc) */
  closable?: boolean;
  /** Prevent closing when clicking outside */
  preventBackdropClose?: boolean;
  /** Custom width override */
  customWidth?: string | number;
  /** Custom height override */
  customHeight?: string | number;
  /** Custom background color class or value */
  customBackground?: string;
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Disable entrance/exit animations */
  disableAnimation?: boolean;
  /** Content children */
  children?: React.ReactNode;
  /** Modal root class */
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[95vw]",
  auto: "max-w-fit",
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = "md",
  position = "center",
  variant = "default",
  title,
  subtitle,
  footer,
  showCloseButton = true,
  closable = true,
  preventBackdropClose = false,
  customWidth,
  customHeight,
  customBackground,
  animationDuration = 0.2,
  disableAnimation = false,
  children,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && closable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Lock Body Scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = ""; // Unlock Body Scroll
    };
  }, [isOpen, closable, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closable && !preventBackdropClose) {
      onClose();
    }
  };

  if (!mounted) return null;

  // Variants
  const isFullscreen = variant === "fullscreen";
  const isPanel = variant === "panel";

  const positionClass =
    position === "top"
      ? "items-start pt-10"
      : position === "bottom"
        ? "items-end pb-10"
        : "items-center justify-center";

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: disableAnimation ? 0 : animationDuration }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            onClick={handleBackdropClick}
          />

          {/* Modal Container */}
          <div
            className={`fixed inset-0 flex p-4 pointer-events-none ${positionClass}`}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: isPanel ? 1 : 0.95,
                y: isPanel ? (position === "bottom" ? 20 : -20) : 10,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: isPanel ? 1 : 0.95,
                y: isPanel ? (position === "bottom" ? 20 : -20) : 10,
              }}
              transition={{
                duration: disableAnimation ? 0 : animationDuration,
                ease: "easeOut",
              }}
              className={`
                                relative pointer-events-auto flex flex-col shadow-xl overflow-hidden
                                ${isFullscreen ? "w-full h-full rounded-none" : "rounded-xl"}
                                ${sizeClasses[size]}
                                ${customWidth ? "" : "w-full"}
                                ${customBackground || "bg-white"}
                                ${className}
                            `}
              style={{
                width: customWidth,
                height: customHeight ?? (isFullscreen ? "100%" : "auto"),
              }}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-start justify-between p-5 border-b border-forest-100 flex-shrink-0">
                  <div className="flex-1 min-w-0">
                    {title && (
                      <h3 className="text-lg font-semibold text-forest-950 truncate">
                        {title}
                      </h3>
                    )}
                    {subtitle && (
                      <p className="text-sm text-forest-600 mt-1">{subtitle}</p>
                    )}
                  </div>
                  {showCloseButton && closable && (
                    <button
                      onClick={onClose}
                      className="ml-4 p-1 rounded-full text-forest-400 hover:text-forest-900 hover:bg-forest-50 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500"
                      aria-label="Close"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 relative">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="p-4 border-t border-forest-100 bg-forest-50/30 flex justify-end gap-3 flex-shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
