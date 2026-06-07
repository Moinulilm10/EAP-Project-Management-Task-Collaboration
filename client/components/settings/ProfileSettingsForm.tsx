import React, { useState, useRef } from "react";
import { Input } from "../ui/Input";
import { Avatar } from "../ui/Avatar";
import { useTranslation } from "react-i18next";
import { MdEdit, MdMail } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";
import { ImageCropperModal } from "./ImageCropperModal";

interface ProfileSettingsFormProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  bio: string;
  setBio: (val: string) => void;
  picture: string | null;
  setPicture: (val: string) => void;
}

export function ProfileSettingsForm({
  name,
  setName,
  email,
  bio,
  setBio,
  picture,
  setPicture,
}: ProfileSettingsFormProps) {

  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 1 * 1024 * 1024) {
      alert(t("File exceeds maximum size of 1 mb"));
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setCropperImageSrc(reader.result as string);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropApply = async (croppedBlob: Blob) => {
    if (!selectedFile) return;
    setIsCropperOpen(false);

    try {
      setIsUploading(true);
      const fileName = `${Math.random()}.jpg`;
      const filePath = `user-avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedBlob, {
          contentType: 'image/jpeg',
        });

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
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCropCancel = () => {
    setIsCropperOpen(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currentAvatar = picture || undefined;

  return (
    <>
      <div className="flex items-center gap-lg pb-md border-b border-outline-variant/10">
        <div className="relative">
          <Avatar
            src={currentAvatar}
            alt="User Avatar"
            size="xl"
            name={name}
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

      <div className="flex flex-col gap-sm">
        <label className="font-label-md text-label-md text-on-surface-variant">
          {t("Full Name")}
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("Full Name") as string}
        />
      </div>

      <div className="flex flex-col gap-sm">
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

      <div className="flex flex-col gap-sm">
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

      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={cropperImageSrc}
        onCancel={handleCropCancel}
        onApply={handleCropApply}
      />
    </>
  );
}
