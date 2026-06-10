"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import { fetchFormSpecificSettings } from '@/lib/settings';
import { FaArrowLeft, FaEye } from 'react-icons/fa';

export default function StaffFormViewClient({ formKey }: { formKey: string }) {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const s = await fetchFormSpecificSettings();
        setSettings(s || {});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getSettingValue = (key: string): string | null => {
    const groups = Object.values(settings || {});
    for (const group of groups) {
      // If group is an array of settings
      if (Array.isArray(group)) {
        const s = group.find((it: any) => it && it.key === key);
        if (s) return s.value || s.defaultValue || null;
      } else if (group && typeof group === 'object') {
        // Sometimes returned as an object keyed by setting keys
        const values = Object.values(group);
        const s: any = values.find((it: any) => it && it.key === key);
        if (s) return s.value || s.defaultValue || null;
      }
    }
    return null;
  };

  const Component = getStaffFormComponent(formKey, 'view');
  
  // Get form-specific settings based on formKey
  const getFormMeta = () => {
    if (formKey === 'fair_work_information') {
      const website = getSettingValue('company_website') || getSettingValue('website') || '';
      const formId = getSettingValue('fair_work_information_form_id') || getSettingValue('employee_details_form_id') || '';
      const reviewDate = getSettingValue('fair_work_information_review_date') || getSettingValue('review_date') || '';
      return {
        website,
        formId,
        reviewDate,
      };
    }
    if (formKey === 'ndis_workforce_capability') {
      return {
        website: getSettingValue('company_website') || getSettingValue('website') || '',
        formId: getSettingValue('ndis_workforce_capability_form_id') || '',
        reviewDate: getSettingValue('ndis_workforce_capability_review_date') || getSettingValue('review_date') || '',
      };
    }
    if (formKey === 'bullying_harassment_training') {
      return {
        website: getSettingValue('company_website') || getSettingValue('website') || null,
        formId: getSettingValue('bullying_harassment_training_form_id') || null,
        // Only use form-specific review date, no fallback to general review_date
        reviewDate: getSettingValue('bullying_harassment_training_review_date') || null,
      };
    }
    if (formKey === 'bullying_training') {
      return {
        website: getSettingValue('company_website') || getSettingValue('website') || null,
        formId: getSettingValue('bullying_training_form_id') || null,
        reviewDate: getSettingValue('bullying_training_review_date') || null,
      };
    }
    // Default meta for other forms (backward compatibility)
    return {
      website: getSettingValue('company_website') || getSettingValue('website') || '',
      version: getSettingValue('employee_details_form_id') || '',
      reviewDate: getSettingValue('review_date') || '',
    };
  };
  
  const meta = getFormMeta();

  return (
    <div className="bg-azure-50 min-h-screen">
      <div className="">
        <div className="bg-white rounded-2xl shadow-soft border border-azure-100 p-8 mb-8  transition">
          <div className="flex items-center gap-6 mb-6">
            <Link href="/admin/staff-forms" className="p-2 rounded-xl bg-azure-50 text-azure-500 hover:bg-azure-100 transition-colors">
              <FaArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-azure-700 text-gold-400 shadow-soft">
                <FaEye className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-azure-700 mb-1">Staff Form</h1>
                <p className="text-sm text-azure-400">Form preview and metadata</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-azure-100">
          <div className="bg-azure-100 to-azure-200 border-b border-azure-200 px-8 py-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-azure-600 to-azure-500 text-white shadow-soft">
                <FaEye className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-azure-700">Form Preview</h2>
                <p className="text-sm text-azure-500">Interactive form view</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="p-8 border-2 border-dashed border-azure-200 rounded-2xl bg-azure-50">
              <Component meta={meta} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


