"use client";

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement>;
  className?: string;
  align?: 'left' | 'right';
  offset?: { x: number; y: number };
}

export default function Dropdown({ isOpen, onClose, children, triggerRef, className = '', align = 'right', offset = { x: 0, y: 4 } }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let top = triggerRect.bottom + offset.y;
      let left = align === 'right' ? triggerRect.right - dropdownRect.width + offset.x : triggerRect.left + offset.x;
      if (left + dropdownRect.width > vw) left = vw - dropdownRect.width - 8;
      if (left < 8) left = 8;
      if (top + dropdownRect.height > vh) top = triggerRect.top - dropdownRect.height - offset.y;
      setPosition({ top, left });
    }
  }, [isOpen, triggerRef, align, offset.x, offset.y]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && triggerRef.current && !triggerRef.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || typeof window === 'undefined') return null;

  return createPortal(
    <div ref={dropdownRef} className={`fixed bg-white rounded-lg shadow-elevated border border-gray-200 py-1 z-[9998] animate-fade-in ${className}`} style={{ top: `${position.top}px`, left: `${position.left}px`, minWidth: '180px' }}>
      {children}
    </div>,
    document.body
  );
}
