import React from "react";
import { useTranslation } from "react-i18next";

export function AppearanceSettings() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h3 className="font-title-md text-title-md text-on-surface">{t("Theme")}</h3>
        <p className="font-body-sm text-body-sm text-secondary mb-xs">
          {t("Customize the look and feel of your workspace.")}
        </p>
        
        <div className="grid grid-cols-3 gap-md mt-sm">
          <label className="cursor-pointer group">
            <input type="radio" name="theme" value="light" className="sr-only peer" />
            <div className="h-24 rounded-lg border-2 border-outline-variant/30 bg-surface-bright peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary flex items-center justify-center transition-all group-hover:border-primary/50 relative overflow-hidden">
              {/* Light theme mockup */}
              <div className="absolute inset-0 flex flex-col">
                <div className="h-6 bg-surface-container-low border-b border-outline-variant/20"></div>
                <div className="flex flex-1">
                  <div className="w-1/3 bg-surface-container-lowest border-r border-outline-variant/20"></div>
                  <div className="flex-1 bg-surface"></div>
                </div>
              </div>
            </div>
            <div className="text-center mt-xs font-label-md text-on-surface">{t("Light")}</div>
          </label>
          
          <label className="cursor-pointer group">
            <input type="radio" name="theme" value="dark" className="sr-only peer" defaultChecked />
            <div className="h-24 rounded-lg border-2 border-outline-variant/30 bg-gray-900 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary flex items-center justify-center transition-all group-hover:border-primary/50 relative overflow-hidden">
              {/* Dark theme mockup */}
              <div className="absolute inset-0 flex flex-col">
                <div className="h-6 bg-gray-800 border-b border-gray-700"></div>
                <div className="flex flex-1">
                  <div className="w-1/3 bg-gray-950 border-r border-gray-700"></div>
                  <div className="flex-1 bg-gray-900"></div>
                </div>
              </div>
            </div>
            <div className="text-center mt-xs font-label-md text-on-surface">{t("Dark")}</div>
          </label>

          <label className="cursor-pointer group">
            <input type="radio" name="theme" value="system" className="sr-only peer" />
            <div className="h-24 rounded-lg border-2 border-outline-variant/30 bg-gradient-to-br from-surface-bright to-gray-900 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary flex items-center justify-center transition-all group-hover:border-primary/50 relative overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="flex-1 flex flex-col">
                   <div className="h-6 bg-surface-container-low border-b border-outline-variant/20"></div>
                   <div className="flex-1 bg-surface"></div>
                </div>
                <div className="flex-1 flex flex-col">
                   <div className="h-6 bg-gray-800 border-b border-gray-700"></div>
                   <div className="flex-1 bg-gray-900"></div>
                </div>
              </div>
            </div>
            <div className="text-center mt-xs font-label-md text-on-surface">{t("System Default")}</div>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-sm mt-md">
        <h3 className="font-title-md text-title-md text-on-surface">{t("Display Density")}</h3>
        <p className="font-body-sm text-body-sm text-secondary mb-xs">
          {t("Adjust how much content is displayed on your screen.")}
        </p>
        
        <div className="flex items-center gap-md">
           <label className="flex items-center gap-sm cursor-pointer">
              <input type="radio" name="density" value="comfortable" defaultChecked className="w-4 h-4 text-primary bg-surface-container-high border-outline-variant focus:ring-primary" />
              <span className="font-body-md text-on-surface">{t("Comfortable")}</span>
           </label>
           <label className="flex items-center gap-sm cursor-pointer ml-lg">
              <input type="radio" name="density" value="compact" className="w-4 h-4 text-primary bg-surface-container-high border-outline-variant focus:ring-primary" />
              <span className="font-body-md text-on-surface">{t("Compact")}</span>
           </label>
        </div>
      </div>

      <div className="flex flex-col gap-sm mt-md">
        <h3 className="font-title-md text-title-md text-on-surface">{t("Accent Color")}</h3>
        <div className="flex gap-sm mt-xs">
           {["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500"].map((color, idx) => (
             <button key={idx} className={`w-8 h-8 rounded-full ${color} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-${color.replace('bg-', '')} transition-transform hover:scale-110 ${idx === 0 ? 'ring-2 ring-offset-2 ring-offset-background ring-blue-500' : ''}`}></button>
           ))}
        </div>
      </div>
    </div>
  );
}
