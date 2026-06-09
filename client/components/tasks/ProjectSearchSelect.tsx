import React, { useState, useRef, useEffect } from "react";
import { MdExpandMore, MdCheck, MdSearch } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectSummary } from "../../services/project.service";
import { useDebounce } from "../../hooks/useDebounce";

interface ProjectSearchSelectProps {
  projects: ProjectSummary[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ProjectSearchSelect({ projects, value, onChange, disabled }: ProjectSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedProject = projects.find((p) => p.id === value);
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleSelect = (id: string) => {
    if (disabled) return;
    onChange(id);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className="relative select-none">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-surface-bright dark:bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 py-3 text-body-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="truncate">
          {selectedProject ? selectedProject.name : "Select a project"}
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
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full bg-surface-bright/95 dark:bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/60 rounded-2xl shadow-xl max-h-[350px] overflow-hidden top-full mt-2 flex flex-col"
          >
            <div className="p-3 border-b border-outline-variant/40 bg-surface-bright dark:bg-surface-container-lowest flex-shrink-0 z-10">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 py-1.5 w-full scrollbar-thin scrollbar-thumb-outline-variant/50">
              {filteredProjects.length === 0 ? (
                <div className="px-4 py-4 text-body-md text-secondary text-center italic">
                  No projects found
                </div>
              ) : (
                filteredProjects.map((opt) => {
                  const isSelected = opt.id === value;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelect(opt.id)}
                      className={`group w-full flex flex-col px-4 py-2.5 text-left transition-colors cursor-pointer hover:bg-surface-container-high dark:hover:bg-surface-container-high/60 ${
                        isSelected
                          ? "bg-primary/10 text-primary font-medium dark:bg-primary/20"
                          : "text-on-surface"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate text-body-md">{opt.name}</span>
                        {isSelected && <MdCheck className="w-5 h-5 flex-shrink-0 ml-2 text-primary" />}
                      </div>
                      
                      {/* Project Overview Hover State */}
                      <div className="max-h-0 overflow-hidden group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out w-full">
                        <div className="pt-2 text-xs text-on-surface-variant flex flex-col gap-1">
                          {opt.description && (
                            <p className="line-clamp-1 italic text-secondary/80">{opt.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 font-mono text-[10px]">
                            <span className="font-medium bg-surface-container px-1.5 py-0.5 rounded uppercase border border-outline-variant/30">
                              {opt.status.replace("_", " ")}
                            </span>
                            <span className="opacity-50">•</span>
                            <span className="bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/30">
                              Members: {opt.memberCount || 0}
                            </span>
                            <span className="opacity-50">•</span>
                            <span className={`px-1.5 py-0.5 rounded border ${
                              opt.deadline && new Date(opt.deadline) < new Date() 
                                ? "bg-error/10 text-error border-error/20" 
                                : "bg-surface-container border-outline-variant/30"
                            }`}>
                              Due: {opt.deadline ? new Date(opt.deadline).toLocaleDateString() : "None"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
