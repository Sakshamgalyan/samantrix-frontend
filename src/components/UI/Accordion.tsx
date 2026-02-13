"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface AccordionProps {
  /** The content to be displayed in the header/trigger area */
  trigger: React.ReactNode;
  /** The content to be displayed when expanded */
  children: React.ReactNode;
  /** Class for the container */
  className?: string;
  /** Class for the trigger button */
  triggerClassName?: string;
  /** Class for the content container */
  contentClassName?: string;
  /** Alignment of the content (not typically used in vertical accordion but kept for compatibility) */
  align?: "left" | "right";
  /** Offset (not typically used in vertical accordion) */
  offset?: number;
  /** Controlled open state */
  open?: boolean;
  /** Callback for open state change */
  onOpenChange?: (open: boolean) => void;
  /** Whether to show the chevron arrow */
  showArrow?: boolean;
  /** Initial open state for uncontrolled mode */
  defaultOpen?: boolean;
  /** Whether to keep content in DOM when closed */
  keepMounted?: boolean;
  /** Duration of animation in seconds */
  duration?: number;
}

export const Accordion = ({
  trigger,
  children,
  className = "",
  triggerClassName = "",
  contentClassName = "",
  // align and offset are kept from input interface but might not be relevant for standard vertical accordion,
  // potentially intended for a popover-style accordion? We'll assume standard vertical for now.
  open,
  onOpenChange,
  showArrow = true,
  defaultOpen = false,
  keepMounted = false,
  duration = 0.2,
}: AccordionProps) => {
  const [isUncontrolledOpen, setIsUncontrolledOpen] = useState(defaultOpen);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : isUncontrolledOpen;

  const handleToggle = () => {
    if (isControlled) {
      onOpenChange?.(!open);
    } else {
      setIsUncontrolledOpen(!isUncontrolledOpen);
      onOpenChange?.(!isUncontrolledOpen);
    }
  };

  return (
    <div
      className={`overflow-hidden border border-forest-200 rounded-lg bg-white ${className}`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-forest-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-forest-300 ${triggerClassName}`}
        aria-expanded={isOpen}
      >
        <div className="flex-1">{trigger}</div>
        {showArrow && (
          <ChevronDown
            className={`w-5 h-5 text-forest-700 transition-transform duration-200 flex-shrink-0 ml-4 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      <AnimatePresence initial={false}>
        {(isOpen || keepMounted) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isOpen ? "auto" : 0,
              opacity: isOpen ? 1 : 0,
            }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration }}
            className="overflow-hidden"
          >
            <div
              className={`p-4 border-t border-forest-100 bg-forest-50/20 ${contentClassName}`}
              // Ensure dropdowns inside can overflow if needed?
              // Actually for standard accordion animation, overflow:hidden is required on the parent wrapper.
              // This is why User requested portal support in Dropdown - so it breaks out of this overflow:hidden.
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
