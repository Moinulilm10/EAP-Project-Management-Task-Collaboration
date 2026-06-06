import React, { useState, useRef, useEffect } from "react";
import { MdExpandMore, MdCheck } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: { label: string; value: string }[] | readonly { label: string; value: string }[];
  containerClassName?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
}

export function Select({
  options,
  value,
  onChange,
  className = "",
  containerClassName = "",
  disabled,
  placeholder,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    if (disabled) return;
    setIsOpen(false);
    if (onChange) {
      // Mock standard change event to maintain integration with existing code
      const event = {
        target: {
          name: props.name,
          value: val,
        },
        currentTarget: {
          name: props.name,
          value: val,
        },
        persist: () => {},
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
  };

  return (
    <div ref={containerRef} className={`relative select-none ${containerClassName}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-surface-bright dark:bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 py-3 text-body-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder || (options[0]?.label ?? "Select...")}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center text-on-surface-variant ml-2"
        >
          <MdExpandMore className="w-5 h-5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ originY: 0 }}
            className="absolute z-50 w-full mt-2 bg-surface-bright/95 dark:bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/60 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
          >
            <div className="py-1.5">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-body-md text-left transition-colors cursor-pointer hover:bg-surface-container-high dark:hover:bg-surface-container-high/60 ${
                      isSelected
                        ? "bg-primary/10 text-primary font-medium dark:bg-primary/20"
                        : "text-on-surface"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <MdCheck className="w-5 h-5 text-primary flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
