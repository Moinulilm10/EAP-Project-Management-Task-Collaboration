import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { authService } from "@/services/auth.service";
import Swal from "sweetalert2";

export function SecuritySettings() {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!currentPassword) {
      alert(t("Please enter your current password"));
      return;
    }
    if (newPassword !== confirmPassword) {
      alert(t("New password and confirm password do not match"));
      return;
    }
    if (newPassword.length < 8) {
      alert(t("New password must be at least 8 characters"));
      return;
    }

    try {
      setIsUpdating(true);
      await authService.updatePassword({ currentPassword, newPassword });
      Swal.fire({
        title: t("Success!"),
        text: t("Password updated successfully!"),
        icon: "success",
        confirmButtonColor: "var(--color-primary, #0066FF)",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message;
      Swal.fire({
        title: t("Error"),
        text: t("Failed to update password: ") + errorMsg,
        icon: "error",
        confirmButtonColor: "var(--color-primary, #0066FF)",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h3 className="font-title-md text-title-md text-on-surface">{t("Change Password")}</h3>
        <p className="font-body-sm text-body-sm text-secondary mb-xs">
          {t("Ensure your account is using a long, random password to stay secure.")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="flex flex-col gap-sm">
            <label className="font-label-md text-label-md text-on-surface-variant">
              {t("Current Password")}
            </label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-xs">
          <div className="flex flex-col gap-sm">
            <label className="font-label-md text-label-md text-on-surface-variant">
              {t("New Password")}
            </label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-sm">
            <label className="font-label-md text-label-md text-on-surface-variant">
              {t("Confirm New Password")}
            </label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Button 
            variant="primary" 
            className="mt-sm" 
            onClick={handlePasswordUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? t("Updating...") : t("Update Password")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-sm mt-xl">
        <h3 className="font-title-md text-title-md text-on-surface">{t("Two-Factor Authentication")}</h3>
        <p className="font-body-sm text-body-sm text-secondary mb-xs">
          {t("Add an extra layer of security to your account.")}
        </p>

        <div className="flex items-center justify-between py-md border border-outline-variant/30 rounded-lg px-md bg-surface-container-lowest">
          <div>
            <div className="font-label-lg text-label-lg text-on-surface">{t("Authenticator App")}</div>
            <div className="font-body-sm text-body-sm text-secondary mt-1">{t("Use an app like Google Authenticator.")}</div>
          </div>
          <Button variant="primary">{t("Enable")}</Button>
        </div>
      </div>

      <div className="flex flex-col gap-sm mt-xl">
        <h3 className="font-title-md text-title-md text-on-surface">{t("Active Sessions")}</h3>
        <p className="font-body-sm text-body-sm text-secondary mb-xs">
          {t("Manage devices that are currently logged into your account.")}
        </p>

        <div className="flex flex-col gap-0 border border-outline-variant/30 rounded-lg overflow-hidden bg-surface-container-lowest">
          <div className="flex items-center justify-between p-md border-b border-outline-variant/10">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface">💻</div>
              <div>
                <div className="font-label-md text-label-md text-on-surface">Mac OS • Chrome</div>
                <div className="font-body-sm text-body-sm text-success mt-1">{t("Active now")} • San Francisco, US</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-md">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface">📱</div>
              <div>
                <div className="font-label-md text-label-md text-on-surface">iOS • Safari</div>
                <div className="font-body-sm text-body-sm text-secondary mt-1">{t("Last active 2 hours ago")} • San Francisco, US</div>
              </div>
            </div>
            <button className="text-error font-label-sm hover:underline">{t("Revoke")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
