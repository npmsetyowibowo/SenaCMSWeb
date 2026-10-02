'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface SectionBubbleProps {
  text: string;
  icon?: React.ReactNode;
  className?: string;
  textColor?: string;
}

/**
 * Neumorphic Section Bubble Pill component
 * Exactly matches user reference screenshot (IMG_1896.jpeg)
 * Elevated soft neumorphic pill with circular icon on the left and bold colored title text.
 */
export function SectionBubble({
  text,
  icon,
  className = '',
  textColor = 'text-[#b45309]',
}: SectionBubbleProps) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full neu-bubble select-none transition-all ${className}`}
    >
      <span className={`shrink-0 ${textColor} flex items-center justify-center`}>
        {icon || <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />}
      </span>
      <span className={`text-xs sm:text-sm md:text-[15px] font-bold tracking-tight leading-none ${textColor}`}>
        {text}
      </span>
    </div>
  );
}
