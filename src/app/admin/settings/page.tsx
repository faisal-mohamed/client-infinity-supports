"use client";

import React from 'react';
import SettingsPageClient from './SettingsPageClient';
import useRequireAuth from '../../hooks/useRequireAuth';

export default function SettingsPage(props: { params: any }) {
  const { session, status } = useRequireAuth();
  if (status === 'loading' || !session) return null;
  return <SettingsPageClient />;
}
