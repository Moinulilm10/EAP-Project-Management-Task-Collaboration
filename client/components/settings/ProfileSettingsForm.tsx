import React, { useState, useRef } from "react";
import { Input } from "../ui/Input";
import { Avatar } from "../ui/Avatar";
import { useTranslation } from "react-i18next";
import { MdEdit, MdMail } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";

interface ProfileSettingsFormProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  email: string;
  bio: string;
  setBio: (val: string) => void;
  picture: string | null;
  setPicture: (val: string) => void;
}

export function ProfileSettingsForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  bio,
  setBio,
  picture,
  setPicture,
}: ProfileSettingsFormProps) {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 800 * 1024) {
      alert(t("File exceeds maximum size of 800K"));
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `user-avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setPicture(publicUrl);
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      alert(t("Error uploading avatar: ") + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const currentAvatar = picture || "https://lh3.googleusercontent.com/aida-public/AB6AXuBOV6tQEuUe4szmiXKsKnmqPuqR7_rpTnOxJraQZz1OKH10YTQfmEwmbCNGBvgdURKDVqEonDEt_QooGFmoeGC2cG7Z6hLi3y67Qg0i-aWlwZdYVVqzhe3bja4QxE783hzTAqcc6sleyN2JTKxopPxewBBIlx-IHuOVSPpl6RWPOjK6fgIoPYg0m7x4PqUDqulTHnadynTh6xKkX0TxixG0pRD182xEd-Tw75TH8l36S2iQiWfgfXMG5k3zzONEXkHU3rmYoVjqPdY";

  return (
    <>
      <div className="flex items-center gap-lg pb-md border-b border-outline-variant/10">
        <div className="relative">
          <Avatar
            src={currentAvatar}
            alt="User Avatar"
            size="xl"
          />
          <button
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="absolute -bottom-0 -right-1 bg-surface-container-lowest text-primary rounded-full p-1 hover:bg-surface-container-low transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            <MdEdit className="w-[22px] h-[22px]" />
          </button>
        </div>
        <div className="flex flex-col gap-xs">
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="bg-surface-container-high/30 border border-outline-variant/50 text-on-surface px-md py-xs rounded-lg font-label-md text-label-md hover:bg-surface-container-high/50 transition-colors w-fit disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? t("Uploading...") : t("Change Avatar")}
          </button>
          <p className="font-label-sm text-label-sm text-secondary">
            {t("JPG, GIF or PNG. Max size of 1 MB")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-md">
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">
            {t("First Name")}
          </label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t("First Name") as string}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">
            {t("Last Name")}
          </label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t("Last Name") as string}
          />
        </div>
      </div>

      <div className="flex flex-col gap-xs">
        <div className="flex justify-between items-center">
          <label className="font-label-md text-label-md text-on-surface-variant">
            {t("Email Address")}
          </label>
          <span className="text-label-sm font-label-sm text-secondary">
            {t("Email cannot be changed")}
          </span>
        </div>
        <Input
          icon={<MdMail className="w-5 h-5 text-on-surface-variant/60" />}
          type="email"
          value={email}
          disabled
          className="bg-surface-container-high/20 opacity-70 text-secondary cursor-not-allowed"
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
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
      </div>
    </>
  );
}
