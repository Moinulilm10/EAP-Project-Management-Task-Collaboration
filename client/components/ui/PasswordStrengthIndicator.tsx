import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdCheck, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

interface PasswordStrengthIndicatorProps {
  password?: string;
  onStrengthChange?: (isValid: boolean) => void;
}

export function PasswordStrengthIndicator({ password = "", onStrengthChange }: PasswordStrengthIndicatorProps) {
  const { t } = useTranslation();

  const [strength, setStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });

  useEffect(() => {
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let score = 0;
    if (hasMinLength) score += 1;
    if (hasUpper) score += 1;
    if (hasLower) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    setStrength({
      score,
      hasMinLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
    });

    if (onStrengthChange) {
      onStrengthChange(score >= 4);
    }
  }, [password, onStrengthChange]);

  if (!password) return null;

  const getStrengthMeta = () => {
    switch (strength.score) {
      case 1:
      case 2:
        return { label: t("Weak"), colorClass: "bg-error", scoreColorClass: "text-error" };
      case 3:
        return { label: t("Medium"), colorClass: "bg-secondary", scoreColorClass: "text-secondary" };
      case 4:
        return { label: t("Good"), colorClass: "bg-primary", scoreColorClass: "text-primary" };
      case 5:
        return { label: t("Strong"), colorClass: "bg-tertiary-fixed-dim", scoreColorClass: "text-tertiary-fixed-dim" };
      default:
        return { label: "", colorClass: "bg-outline-variant/30", scoreColorClass: "text-outline" };
    }
  };

  const strengthMeta = getStrengthMeta();

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2 p-2 bg-surface-container/30 border border-outline-variant/30 rounded-lg overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {t("Password Strength")}
        </span>
        <span className={`font-label-sm text-label-sm font-bold ${strengthMeta.scoreColorClass}`}>
          {strengthMeta.label}
        </span>
      </div>

      {/* Progress Bar Segments */}
      <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full relative">
        {[1, 2, 3, 4, 5].map((level) => (
          <div key={level} className="h-full rounded-full bg-outline-variant/20 overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: strength.score >= level ? "100%" : "0%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`absolute top-0 left-0 h-full ${strengthMeta.colorClass}`}
            />
          </div>
        ))}
      </div>

      {/* Password criteria checklist */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1">
        <div className="flex items-center gap-1">
          {strength.hasMinLength ? (
            <MdCheck className="text-tertiary-fixed-dim w-3.5 h-3.5" />
          ) : (
            <MdClose className="text-outline w-3.5 h-3.5" />
          )}
          <span className={`text-[10px] font-medium leading-none ${strength.hasMinLength ? "text-on-surface" : "text-on-surface-variant/60"}`}>
            {t("Min. 8 characters")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {strength.hasUpper ? (
            <MdCheck className="text-tertiary-fixed-dim w-3.5 h-3.5" />
          ) : (
            <MdClose className="text-outline w-3.5 h-3.5" />
          )}
          <span className={`text-[10px] font-medium leading-none ${strength.hasUpper ? "text-on-surface" : "text-on-surface-variant/60"}`}>
            {t("Uppercase letter")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {strength.hasLower ? (
            <MdCheck className="text-tertiary-fixed-dim w-3.5 h-3.5" />
          ) : (
            <MdClose className="text-outline w-3.5 h-3.5" />
          )}
          <span className={`text-[10px] font-medium leading-none ${strength.hasLower ? "text-on-surface" : "text-on-surface-variant/60"}`}>
            {t("Lowercase letter")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {strength.hasNumber ? (
            <MdCheck className="text-tertiary-fixed-dim w-3.5 h-3.5" />
          ) : (
            <MdClose className="text-outline w-3.5 h-3.5" />
          )}
          <span className={`text-[10px] font-medium leading-none ${strength.hasNumber ? "text-on-surface" : "text-on-surface-variant/60"}`}>
            {t("Number (0-9)")}
          </span>
        </div>

        <div className="flex items-center gap-1 col-span-2">
          {strength.hasSpecial ? (
            <MdCheck className="text-tertiary-fixed-dim w-3.5 h-3.5" />
          ) : (
            <MdClose className="text-outline w-3.5 h-3.5" />
          )}
          <span className={`text-[10px] font-medium leading-none ${strength.hasSpecial ? "text-on-surface" : "text-on-surface-variant/60"}`}>
            {t("Special character (@, #, $, etc.)")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
