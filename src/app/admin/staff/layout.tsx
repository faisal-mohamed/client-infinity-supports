"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout hideSidebarOnFormPages={false} showUserInfo={false} contentPadding="custom" customPadding="p-8 lg:ml-72">
      {children}
    </AppLayout>
  );
}


