"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormRenderer from "@/components/clients-intake-form/FormRenderer";
import Link from "next/link";
import { FaArrowLeft, FaFileAlt, FaCode, FaCalendarAlt, FaEye, FaGlobe, FaSpinner, FaCog, FaBuilding } from "react-icons/fa";
import HomeRiskAssesmentView from "@/components/home_visit_risk_assessment/view";
import { fetchFormSpecificSettings, fetchSettings } from "@/lib/settings";
import PersonCentredPlanView from "@/components/person_centred_plan/view";
import SADeliverySupports from "@/app/form-components/SA-delivery-of-supports/page";
import ParticipantRiskAssessment from "@/app/form-components/participant-risk-assessment/page";
import EmergencyDrill from "@/app/form-components/emergency-drill/page";

import IndividualRiskAssessment from "@/app/form-components/individual-risk-assessment/page";
import WelcomeFormView from "@/components/welcome-form/View";
import ScheduleForSupportView from "@/components/support-action-plan/View";

import MDTView from "@/components/mdt/View";

// Types for settings
interface AppSetting {
  id: number;
  key: string;
  value: string | null;
  type: string;
  category: string;
  label: string;
  description?: string;
  isRequired: boolean;
  defaultValue?: string;
  validation?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GroupedSettings {
  [category: string]: AppSetting[];
}

export default function ViewFormClient({ formId }: { formId: string }) {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<GroupedSettings>({});
  const [settingsLoading, setSettingsLoading] = useState(true);
  const router = useRouter();

  // Helper function to get a specific setting value
  const getSettingValue = (key: string): string | null => {
    for (const category of Object.values(settings)) {
      const setting = category.find(s => s.key === key);
      if (setting) {
        return setting.value || setting.defaultValue || null;
      }
    }
    return null;
  };

  // Helper function to get setting by key with full object
  const getSetting = (key: string): AppSetting | null => {
    for (const category of Object.values(settings)) {
      const setting = category.find(s => s.key === key);
      if (setting) {
        return setting;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchFormAndSettings = async () => {
      try {
        setLoading(true);
        setSettingsLoading(true);

        // Fetch form and settings in parallel
        const [formResponse, settingsData] = await Promise.all([
          fetch(`/api/forms/${formId}`),
          fetchFormSpecificSettings()
        ]);

        // Handle form response
        if (!formResponse.ok) {
          throw new Error("Failed to fetch form");
        }
        const formData = await formResponse.json();
        console.log("Fetched form data:", formData);
        setForm(formData);

        // Handle settings data
        console.log("Fetched all settings data:", settingsData);
        setSettings(settingsData);

      } catch (err) {
        console.error("Error fetching form or settings:", err);
        setError("Failed to load form. Please try again.");
      } finally {
        setLoading(false);
        setSettingsLoading(false);
      }
    };

    if (formId) {
      fetchFormAndSettings();
    }
  }, [formId]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Form</h3>
              <p className="text-gray-600 font-medium">Please wait while we fetch the form details...</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md mx-4 border border-red-200">
              <div className="p-6 rounded-full bg-red-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <FaFileAlt className="h-12 w-12 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-red-800 mb-3">Form Not Found</h1>
              <p className="text-red-600 mb-6 leading-relaxed">
                {error || "The requested form could not be found or loaded."}
              </p>
              <Link
                href="/admin/forms"
                className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Back to Forms
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Combined Header with Navigation and Metadata */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
          {/* Navigation and Title Section */}
          <div className="flex items-center gap-6 mb-8">
            <Link
              href="/admin/forms"
              className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 hover:from-indigo-200 hover:to-indigo-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FaArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <FaEye className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
                <p className="text-base text-gray-600">Form preview and detailed information</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-500">Form loaded successfully</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Metadata Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
              </div>
              <h2 className="text-xl font-bold text-gray-900">Form Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                    <FaCode className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Form Key</p>
                    <p className="font-bold text-gray-900 text-lg">{form.formKey}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md">
                    <FaFileAlt className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Version</p>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        v{form.version}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md">
                    <FaCalendarAlt className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Created Date</p>
                    <p className="font-bold text-gray-900">
                      {new Date(form.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(form.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            
            
          </div>
        </div>

        {/* Enhanced Form preview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
                <FaEye className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Form Preview</h2>
                <p className="text-sm text-gray-600 mt-1">Interactive preview of the form structure and fields</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="form-preview-container max-w-5xl mx-auto">
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                {form.formKey === "client_intake_form" ? (
                  <FormRenderer formKey={form.formKey} formSchema={form.schema} settings={settings} />
                ) : form.formKey === "home_visit_risk_assessment" ? (
                  <HomeRiskAssesmentView formKey={form.formKey} settings={settings}/>
                ) : form.formKey === "person_centred_plan" ? (
                  <PersonCentredPlanView formKey={form.formKey} settings={settings} />
                ) : form.formKey === "sa_delivery_of_supports" ? (
                  <SADeliverySupports formKey={form.formKey} settings={settings} />
                ) : form.formKey === "participant_risk_assessment" ? (
                  <ParticipantRiskAssessment formKey={form.formKey} settings={settings} />
                ) : 


                form.formKey === "individual_risk_assessment" ? (
                  <IndividualRiskAssessment formKey={form.formKey} settings={settings} />
                ) : form.formKey === "emergency_drill" ? (
                  <EmergencyDrill formKey={form.formKey} settings={settings} />
                ) :
                
                form.formKey === "welcome_form" ? (
                  <WelcomeFormView formKey={form.formKey} settings={settings}/>
                ) : 

                form.formKey === "schedule_for_support" ? (
                  <ScheduleForSupportView formKey={form.formKey} settings={settings}/>
                ) : 


                form.formKey === "multi_disciplinary_meeting" ? (
                  <MDTView formKey={form.formKey} settings={settings}/>
                ) : 

                (
                  <div className="text-center py-16">
                    <div className="p-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                      <FaFileAlt className="text-gray-400 text-4xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Preview Not Available</h3>
                    <p className="text-gray-500 font-medium mb-2 max-w-md mx-auto leading-relaxed">
                      This form type does not support preview functionality.
                    </p>
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-lg mx-auto">
                      <p className="text-sm font-medium text-blue-700">
                        ℹ️ Currently supported: Client Intake Form and Home Visit Risk Assessment
                      </p>
                    </div>
                  </div>
                )}
                
             
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
