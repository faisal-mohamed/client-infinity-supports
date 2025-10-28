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

export default function Dropdown({ 
  isOpen, 
  onClose, 
  children, 
  triggerRef,
  className = '',
  align = 'right',
  offset = { x: 0, y: 8 }
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate dropdown position based on trigger element
  useEffect(() => {
    if (isOpen && triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = triggerRect.bottom + offset.y;
      let left = align === 'right' 
        ? triggerRect.right - dropdownRect.width + offset.x
        : triggerRect.left + offset.x;

      // Adjust if dropdown would go off-screen horizontally
      if (left + dropdownRect.width > viewportWidth) {
        left = viewportWidth - dropdownRect.width - 16; // 16px margin
      }
      if (left < 16) {
        left = 16; // 16px margin
      }

      // Adjust if dropdown would go off-screen vertically
      if (top + dropdownRect.height > viewportHeight) {
        top = triggerRect.top - dropdownRect.height - offset.y;
      }

      setPosition({ top, left });
    }
  }, [isOpen, triggerRef, align, offset.x, offset.y]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  // Only render on client side to avoid hydration issues
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div 
      ref={dropdownRef}
      className={`fixed bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-[9998] animate-in fade-in zoom-in-95 duration-200 ${className}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: '224px' // 56 * 4 = w-56
      }}
    >
      {children}
    </div>,
    document.body
  );
}
