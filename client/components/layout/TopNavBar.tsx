import React from "react";
import { Button } from "../ui/Button";

export function TopNavBar() {
  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-280px)] z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop ml-auto">
      <div className="flex items-center gap-sm md:hidden">
        <button className="text-on-surface-variant">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-headline-md text-headline-md font-black text-primary">ProSync</span>
      </div>
      
      <div className="hidden md:flex items-center relative w-96">
        <span className="material-symbols-outlined absolute left-sm text-on-surface-variant">search</span>
        <input
          className="w-full pl-xl pr-sm py-sm bg-surface-container-low border-none rounded-full text-body-md focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
          placeholder="Search projects..."
          type="text"
        />
      </div>

      <div className="flex items-center gap-md">
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">dark_mode</span>
        </button>
        
        <Button className="hidden md:flex">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Task
        </Button>
        
        <div className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden border border-outline-variant/30 cursor-pointer flex items-center justify-center text-on-secondary-container font-bold">
          U
        </div>
      </div>
    </header>
  );
}
