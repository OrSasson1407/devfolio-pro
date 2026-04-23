'use client';

import React, { useState } from 'react';

interface HireMeBadgeProps {
  openToWork: boolean;
  contactEmail?: string | null;
}

export default function HireMeBadge({ openToWork, contactEmail }: HireMeBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!openToWork) return null;

  return (
    <div className="relative inline-block">
      {/* Badge Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100 transition-colors dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        Open to work
      </button>

      {/* Popover Lead Capture */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 p-4 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-zinc-900 dark:border-zinc-800 z-50">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Let's build something great.</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            I'm currently exploring new opportunities. Get in touch to discuss how I can help your team.
          </p>
          
          {contactEmail ? (
            <a
              href={`mailto:${contactEmail}?subject=Job Opportunity`}
              className="block w-full py-2 text-center text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
            >
              Contact Me
            </a>
          ) : (
            <div className="text-sm text-red-500 italic">
              No contact email provided.
            </div>
          )}
        </div>
      )}
    </div>
  );
}