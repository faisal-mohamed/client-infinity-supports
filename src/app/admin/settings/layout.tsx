"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';

export default function AdminSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout hideSidebarOnFormPages={true} showUserInfo={true}>
      {children}
    </AppLayout>
  );
}
