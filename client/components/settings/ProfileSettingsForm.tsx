import React from "react";
import { Input } from "../ui/Input";
import { Avatar } from "../ui/Avatar";
import { IconButton } from "../ui/IconButton";
import { useTranslation } from "react-i18next";
import { MdEdit, MdMail } from "react-icons/md";

export function ProfileSettingsForm() {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center gap-lg pb-md border-b border-outline-variant/10">
        <div className="relative">
          <Avatar
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOV6tQEuUe4szmiXKsKnmqPuqR7_rpTnOxJraQZz1OKH10YTQfmEwmbCNGBvgdURKDVqEonDEt_QooGFmoeGC2cG7Z6hLi3y67Qg0i-aWlwZdYVVqzhe3bja4QxE783hzTAqcc6sleyN2JTKxopPxewBBIlx-IHuOVSPpl6RWPOjK6fgIoPYg0m7x4PqUDqulTHnadynTh6xKkX0TxixG0pRD182xEd-Tw75TH8l36S2iQiWfgfXMG5k3zzONEXkHU3rmYoVjqPdY"
            alt="User Avatar"
            size="xl"
          />
          <button className="absolute -bottom-0 -right-1 bg-surface-container-lowest text-primary rounded-full p-1 hover:bg-surface-container-low transition-colors flex items-center justify-center">
            <MdEdit className="w-[22px] h-[22px]" />
          </button>
        </div>
        <div className="flex flex-col gap-xs">
          <button className="bg-surface-container-high/30 border border-outline-variant/50 text-on-surface px-md py-xs rounded-lg font-label-md text-label-md hover:bg-surface-container-high/50 transition-colors w-fit">
            {t("Change Avatar")}
          </button>
          <p className="font-label-sm text-label-sm text-secondary">
            {t("JPG, GIF or PNG. Max size of 800K")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-md">
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">
            {t("First Name")}
          </label>
          <Input defaultValue="Alex" />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">
            {t("Last Name")}
          </label>
          <Input defaultValue="Morgan" />
        </div>
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-md text-label-md text-on-surface-variant">
          {t("Email Address")}
        </label>
        <Input
          icon={<MdMail className="w-5 h-5 text-on-surface-variant/60" />}
          type="email"
          defaultValue="alex.morgan@example.com"
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-md text-label-md text-on-surface-variant">
          {t("Bio")}
        </label>
        <textarea
          className="w-full bg-surface-bright border border-outline-variant/50 rounded-lg px-md py-sm text-body-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          placeholder={t("Write a few sentences about yourself...") as string}
          rows={3}
        ></textarea>
      </div>
    </>
  );
}
