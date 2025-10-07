"use client";

import { useEffect } from 'react';

export default function NoFlashScript() {
  useEffect(() => {
    // This runs only on the client side after hydration
    const html = document.documentElement;
    html.style.visibility = 'visible';
  }, []);

  return null;
}
