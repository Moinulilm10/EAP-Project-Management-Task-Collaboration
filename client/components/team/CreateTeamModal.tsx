import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdClose, MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { Button } from "../ui/Button";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: { name: string; description: string; maxMembers: number }) => Promise<void>;
}

export function CreateTeamModal({ isOpen, onClose, onSave }: CreateTeamModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await onSave({ name, description, maxMembers });
      setName("");
      setDescription("");
      setMaxMembers(10);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSubmit}
              className="w-[90%] max-w-[500px] rounded-3xl bg-surface-container-lowest border border-outline-variant/20 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
                <h2 className="font-title-lg text-title-lg text-on-surface">{t("Create New Team")}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5 px-6 py-6">
                <div>
                  <label className="block font-label-sm text-label-sm text-secondary mb-2">
                    {t("Team Name")}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("e.g. Frontend Development")}
                    className="w-full rounded-2xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-secondary mb-2">
                    {t("Description")}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("What is the purpose of this team?")}
                    className="w-full rounded-2xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-secondary mb-2">
                    {t("Initial Member Capacity")}
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={maxMembers}
                      onChange={(e) => setMaxMembers(parseInt(e.target.value) || 1)}
                      className="w-full rounded-2xl border border-outline-variant/50 bg-surface-container-lowest pl-4 pr-14 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-sm"
                      required
                    />
                    <div className="absolute right-2 top-1.5 bottom-1.5 flex flex-col items-center justify-center bg-surface-container rounded-xl border border-outline-variant/30 overflow-hidden divide-y divide-outline-variant/30 shadow-sm group-hover:border-primary/30 transition-colors">
                      <button
                        type="button"
                        onClick={() => setMaxMembers(prev => Math.min(1000, prev + 1))}
                        className="flex-1 px-2 text-secondary hover:text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors flex items-center justify-center"
                        tabIndex={-1}
                      >
                        <MdKeyboardArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setMaxMembers(prev => Math.max(1, prev - 1))}
                        className="flex-1 px-2 text-secondary hover:text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors flex items-center justify-center"
                        tabIndex={-1}
                      >
                        <MdKeyboardArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="font-body-sm text-secondary mt-2">
                    {t("You can always increase this capacity later.")}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 pb-6 mt-2">
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                  {t("Cancel")}
                </Button>
                <Button type="submit" variant="primary" disabled={loading || !name.trim()}>
                  {loading ? t("Saving...") : t("Create Team")}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
