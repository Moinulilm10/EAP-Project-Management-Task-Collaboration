import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdClose, MdGroup, MdFolderOpen, MdAssignment, MdPersonAdd, MdDelete, MdEdit, MdPersonRemove } from "react-icons/md";
import { Team } from "../../services/team.service";
import { Button } from "../ui/Button";
import Swal from "sweetalert2";
import { useTeamStore } from "../../stores/teamStore";
import { toast } from "react-toastify";

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
}

export function TeamDetailsModal({ isOpen, onClose, team }: TeamDetailsModalProps) {
  const { t } = useTranslation();
  const { updateCapacity, removeMember, updateTeam, deleteTeam } = useTeamStore();
  const [activeTab, setActiveTab] = useState<"members" | "projects" | "tasks">("members");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(team.name);
  const [editDesc, setEditDesc] = useState(team.description || "");

  const handleUpdateTeam = async () => {
    if (!editName.trim()) return;
    try {
      await updateTeam(team.id, { name: editName, description: editDesc });
      setIsEditing(false);
      toast.success(t("Team updated successfully"));
    } catch (err: any) {
      toast.error(err.message || t("Failed to update team"));
    }
  };

  const handleDeleteTeam = async () => {
    const result = await Swal.fire({
      title: t("Are you sure?"),
      text: t("This team will be permanently deleted."),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: t("Yes, delete it!"),
      buttonsStyling: false,
      customClass: {
        popup: "bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-3xl",
        title: "text-on-surface font-title-lg",
        htmlContainer: "text-secondary font-body-md",
        confirmButton: "bg-error text-on-error hover:bg-error/90 rounded-xl px-5 py-2.5 font-label-md ml-3 transition-colors",
        cancelButton: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-xl px-5 py-2.5 font-label-md transition-colors"
      }
    });

    if (result.isConfirmed) {
      try {
        await deleteTeam(team.id);
        toast.success(t("Team deleted successfully"));
        onClose();
      } catch (err: any) {
        toast.error(err.message || t("Failed to delete team"));
      }
    }
  };

  const handleRemoveMember = async (userId: string) => {
    const result = await Swal.fire({
      title: t("Remove Member?"),
      text: t("Are you sure you want to remove this member?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: t("Remove"),
      buttonsStyling: false,
      customClass: {
        popup: "bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-3xl",
        title: "text-on-surface font-title-lg",
        htmlContainer: "text-secondary font-body-md",
        confirmButton: "bg-error text-on-error hover:bg-error/90 rounded-xl px-5 py-2.5 font-label-md ml-3 transition-colors",
        cancelButton: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-xl px-5 py-2.5 font-label-md transition-colors"
      }
    });

    if (result.isConfirmed) {
      try {
        await removeMember(team.id, userId);
        toast.success(t("Member removed successfully"));
      } catch (err: any) {
        toast.error(err.message || t("Failed to remove member"));
      }
    }
  };

  const handleIncreaseCapacity = async () => {
    const minMembers = team.members?.length || 0;
    const result = await Swal.fire({
      title: t("Increase Team Capacity"),
      html: `
        <div class="text-left mb-2 text-secondary font-label-sm">${t("New Maximum Members")}</div>
        <div class="relative group">
          <input
            type="number"
            id="swal-capacity-input"
            min="${Math.max(1, minMembers)}"
            max="1000"
            value="${team.maxMembers}"
            class="w-full rounded-2xl border border-outline-variant/50 bg-surface-container-lowest pl-4 pr-14 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-sm"
          />
          <div class="absolute right-2 top-1.5 bottom-1.5 flex flex-col items-center justify-center bg-surface-container rounded-xl border border-outline-variant/30 overflow-hidden divide-y divide-outline-variant/30 shadow-sm group-hover:border-primary/30 transition-colors">
            <button type="button" id="swal-cap-up" class="flex-1 px-2 text-secondary hover:text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>
            </button>
            <button type="button" id="swal-cap-down" class="flex-1 px-2 text-secondary hover:text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>
            </button>
          </div>
        </div>
      `,
      showCancelButton: true,
      buttonsStyling: false,
      customClass: {
        popup: "bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-3xl",
        title: "text-on-surface font-title-lg",
        confirmButton: "bg-primary text-on-primary hover:bg-primary/90 rounded-xl px-5 py-2.5 font-label-md ml-3 transition-colors",
        cancelButton: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-xl px-5 py-2.5 font-label-md transition-colors"
      },
      didOpen: () => {
        const input = document.getElementById('swal-capacity-input') as HTMLInputElement;
        const upBtn = document.getElementById('swal-cap-up');
        const downBtn = document.getElementById('swal-cap-down');
        
        upBtn?.addEventListener('click', () => {
          input.value = String(Math.min(1000, parseInt(input.value || "1") + 1));
        });
        
        downBtn?.addEventListener('click', () => {
          input.value = String(Math.max(Math.max(1, minMembers), parseInt(input.value || "1") - 1));
        });
      },
      preConfirm: () => {
        const input = document.getElementById('swal-capacity-input') as HTMLInputElement;
        const value = parseInt(input.value);
        if (!value || value < minMembers) {
          Swal.showValidationMessage(t("Capacity must be greater than or equal to current member count"));
          return false;
        }
        return value;
      }
    });

    if (result.isConfirmed && result.value) {
      try {
        await updateCapacity(team.id, result.value);
        toast.success(t("Capacity updated successfully"));
      } catch (err: any) {
        toast.error(err.message || t("Failed to update capacity"));
      }
    }
  };

  if (!isOpen || !team) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-3xl w-[90%] max-w-[800px] shadow-elevation-3 flex flex-col h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
          <div className="flex-1 mr-4">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 font-title-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <div className="flex gap-2">
                  <Button variant="primary" onClick={handleUpdateTeam} className="px-4 py-1.5 text-sm">{t("Save")}</Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)} className="px-4 py-1.5 text-sm">{t("Cancel")}</Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-title-lg text-title-lg text-on-surface">{team.name}</h2>
                <p className="font-body-sm text-secondary mt-1">{team.description}</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant" title={t("Edit Team")}>
                  <MdEdit className="w-5 h-5" />
                </button>
                <button onClick={handleDeleteTeam} className="p-2 rounded-full hover:bg-error/10 transition-colors text-error" title={t("Delete Team")}>
                  <MdDelete className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-container-highest transition-colors text-on-surface-variant"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex px-6 border-b border-outline-variant/30 overflow-x-auto">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-3 font-label-md transition-colors whitespace-nowrap border-b-2 ${
              activeTab === "members" ? "border-primary text-primary" : "border-transparent text-secondary hover:text-on-surface"
            }`}
          >
            <MdGroup className="inline w-4 h-4 mr-2" />
            {t("Members")} ({team.members?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-3 font-label-md transition-colors whitespace-nowrap border-b-2 ${
              activeTab === "projects" ? "border-primary text-primary" : "border-transparent text-secondary hover:text-on-surface"
            }`}
          >
            <MdFolderOpen className="inline w-4 h-4 mr-2" />
            {t("Projects")} ({team.projectTeams?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-3 font-label-md transition-colors whitespace-nowrap border-b-2 ${
              activeTab === "tasks" ? "border-primary text-primary" : "border-transparent text-secondary hover:text-on-surface"
            }`}
          >
            <MdAssignment className="inline w-4 h-4 mr-2" />
            {t("Tasks")} ({team.taskTeams?.length || 0})
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-surface">
          {activeTab === "members" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-title-md text-on-surface">{t("Team Members")}</h3>
                  <p className="font-body-sm text-secondary">
                    {t("Capacity")}: {team.members?.length || 0} / {team.maxMembers}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={handleIncreaseCapacity} className="px-3 py-1.5 text-sm h-auto min-w-0">
                    {t("Increase Capacity")}
                  </Button>
                  <Button variant="primary" className="px-3 py-1.5 text-sm h-auto min-w-0">
                    <MdPersonAdd className="w-4 h-4 mr-1" />
                    {t("Add Member")}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {team.members?.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {member.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-label-lg text-on-surface">{member.user?.name}</p>
                        <p className="font-body-sm text-secondary">{member.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-label-sm px-2 py-1 bg-secondary-container text-on-secondary-container rounded-lg">
                        {member.role}
                      </span>
                      <button
                        onClick={() => handleRemoveMember(member.userId)}
                        className="p-1.5 rounded-full hover:bg-error/10 transition-colors text-error"
                        title={t("Remove Member")}
                      >
                        <MdPersonRemove className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {(!team.members || team.members.length === 0) && (
                  <p className="text-secondary text-center py-4">{t("No members found")}</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-4">
              <h3 className="font-title-md text-on-surface">{t("Assigned Projects")}</h3>
              <div className="space-y-2">
                {team.projectTeams?.map((pt) => (
                  <div key={pt.id} className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
                    <div>
                      <p className="font-label-lg text-on-surface">{pt.project?.name}</p>
                      <p className="font-body-sm text-secondary capitalize">{pt.project?.status}</p>
                    </div>
                  </div>
                ))}
                {(!team.projectTeams || team.projectTeams.length === 0) && (
                  <p className="text-secondary text-center py-4">{t("No projects assigned")}</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-4">
              <h3 className="font-title-md text-on-surface">{t("Assigned Tasks")}</h3>
              <div className="space-y-2">
                {team.taskTeams?.map((tt) => (
                  <div key={tt.id} className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
                    <div>
                      <p className="font-label-lg text-on-surface">{tt.task?.title}</p>
                      <p className="font-body-sm text-secondary capitalize">{tt.task?.status}</p>
                    </div>
                  </div>
                ))}
                {(!team.taskTeams || team.taskTeams.length === 0) && (
                  <p className="text-secondary text-center py-4">{t("No tasks assigned")}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
