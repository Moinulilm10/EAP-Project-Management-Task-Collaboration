import React from "react";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";

interface SettingsSectionWrapperProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
}

export function SettingsSectionWrapper({
  id,
  title,
  description,
  children,
  onSave,
  onCancel,
}: SettingsSectionWrapperProps) {
  const { t } = useTranslation();

  return (
    <section
      id={id}
      className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="px-lg py-md border-b border-outline-variant/20 bg-surface-bright/50">
        <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
        <p className="font-body-md text-body-md text-secondary mt-xs">{description}</p>
      </div>
      
      <div className="p-lg flex flex-col gap-md">
        {children}
      </div>

      <div className="px-lg py-sm bg-surface/50 border-t border-outline-variant/20 flex justify-end gap-sm">
        <Button variant="ghost" onClick={onCancel}>
          {t("Cancel")}
        </Button>
        <Button variant="primary" onClick={onSave}>
          {t("Save Changes")}
        </Button>
      </div>
    </section>
  );
}
