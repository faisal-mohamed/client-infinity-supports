"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormRenderer from "@/components/clients-intake-form/FormRenderer";
import ClientIntakeFormDynamic from "@/app/components/forms/client_intake_form/ClientIntakeFormDynamic";
import Link from "next/link";
import {
  FaArrowLeft,
  FaFileAlt,
  FaCode,
  FaCalendarAlt,
  FaEye
} from "react-icons/fa";
import HomeRiskAssesmentView from "@/components/home_visit_risk_assessment/view";
import { fetchFormSpecificSettings } from "@/lib/settings";
import PersonCentredPlanView from "@/components/person_centred_plan/view";
import SADeliverySupports from "@/app/form-components/SA-delivery-of-supports/page";
import ParticipantRiskAssessmentView from "@/components/participant-risk-assessment/view";
import EmergencyDrill from "@/app/form-components/emergency-drill/page";
import IndividualRiskAssessment from "@/app/form-components/individual-risk-assessment/page";
import WelcomeFormView from "@/components/welcome-form/View";
import ScheduleForSupportView from "@/components/support-action-plan/View";
import ScheduleOfSupportsView from "@/components/schedule-of-supports/View";
import MDTView from "@/components/mdt/View";
import SASupportCoordination from "@/app/form-components/sa-support-coordination/page";
import ConflictOfInterestView from "@/app/components/forms/conflict_of_interest/View";
import NDISConsentView from "@/app/components/forms/ndis_consent/View";
import ReviewOfDecisionView from "@/app/components/forms/review_of_decision/View";
import ChangeOfDetailsView from "@/app/components/forms/change_of_details/View";

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

  const getSettingValue = (key: string): string | null => {
    for (const category of Object.values(settings)) {
      const setting = category.find(s => s.key === key);
      if (setting) return setting.value || setting.defaultValue || null;
    }
    return null;
  };

  const getSetting = (key: string): AppSetting | null => {
    for (const category of Object.values(settings)) {
      const setting = category.find(s => s.key === key);
      if (setting) return setting;
    }
    return null;
  };

  useEffect(() => {
    const fetchFormAndSettings = async () => {
      try {
        setLoading(true);
        setSettingsLoading(true);
        const [formResponse, settingsData] = await Promise.all([
          fetch(`/api/forms/${formId}`),
          fetchFormSpecificSettings()
        ]);
        if (!formResponse.ok) throw new Error("Failed to fetch form");
        const formData = await formResponse.json();
        setForm(formData);
        setSettings(settingsData);
      } catch (err) {
        console.error("Error fetching form or settings:", err);
        setError("Failed to load form. Please try again.");
      } finally {
        setLoading(false);
        setSettingsLoading(false);
      }
    };

    if (formId) fetchFormAndSettings();
  }, [formId]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-azure-50 to-azure-100 min-h-screen flex justify-center items-center">
        <div className="bg-gradient-to-br from-azure-50 to-azure-100 min-h-screen flex items-center justify-center">
          <div className="flex justify-center items-center h-80">
            <div className="text-center">
              {/* Spinner */}
              <div className="w-20 h-20 border-4 border-t-gold-500 border-gold-200 rounded-full animate-spin mx-auto mb-6"></div>

              {/* Text */}
              <h3 className="text-xl font-bold text-azure-700 mb-2">
                View Form Loading
              </h3>
              <p className="text-azure-500 font-medium">
                Please wait while we load the form to view...
              </p>

              {/* Bouncing dots */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-azure-50 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gold-200 p-8 max-w-md text-center">
          <div className="bg-gold-100 p-4 rounded-full w-20 h-20 mx-auto mb-4">
            <FaFileAlt className="text-gold-500 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-gold-800 mb-2">Form Not Found</h2>
          <p className="text-gold-600 mb-4">{error || "The requested form could not be found."}</p>
          <Link href="/admin/forms">
            <span className="inline-block px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded-xl transition font-semibold shadow">Back to Forms</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-azure-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-azure-100 p-8 mb-8 hover:shadow-xl transition">
          <div className="flex items-center gap-6 mb-6">
            <Link
              href="/admin/forms"
              className="p-3 rounded-xl bg-gradient-to-br from-gold-100 to-gold-200 text-gold-600 hover:from-gold-200 hover:to-gold-300 shadow-md hover:shadow-lg transform hover:scale-105 transition"
            >
              <FaArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-lg">
                <FaEye className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-azure-800 mb-1">{form.title}</h1>
                <p className="text-sm text-azure-400">Form preview and metadata</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-azure-100">
          <div className="bg-gradient-to-r from-azure-100 to-azure-200 border-b border-azure-200 px-8 py-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-azure-500 to-azure-500 text-white shadow-md">
                <FaEye className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-azure-800">Form Preview</h2>
                <p className="text-sm text-azure-500">Interactive form view</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="p-8 border-2 border-dashed border-azure-200 rounded-2xl bg-azure-50">
              {form.formKey === "client_intake_form" ? (
                <>
                  {console.log("ViewForm DEBUG - form.data:", form.data)}
                  {console.log("ViewForm DEBUG - settings:", settings)}
                  <ClientIntakeFormDynamic formKey={form.formKey} settings={settings} formData={form.data} />
                </>
              ) : form.formKey === "home_visit_risk_assessment" ? (
                <HomeRiskAssesmentView formKey={form.formKey} settings={settings} formData={form.data} commonFieldsData={form.commonFields} />
              ) : form.formKey === "person_centred_plan" ? (
                <PersonCentredPlanView formKey={form.formKey} settings={settings} />
              ) : form.formKey === "sa_delivery_of_supports" ? (
                <SADeliverySupports formKey={form.formKey} settings={settings} />
              ) : form.formKey === "participant_risk_assessment" ? (
                <ParticipantRiskAssessmentView formKey={form.formKey} settings={settings} />
              ) : form.formKey === "individual_risk_assessment" ? (
                <IndividualRiskAssessment formKey={form.formKey} settings={settings} />
              ) : form.formKey === "emergency_drill" ? (
                <EmergencyDrill formKey={form.formKey} settings={settings} />
              ) : form.formKey === "welcome_form" ? (
                <WelcomeFormView formKey={form.formKey} settings={settings} />
              ) : form.formKey === "support_action_plan" ? (
                <ScheduleForSupportView formKey={form.formKey} settings={settings} />
              ) : form.formKey === "multi_disciplinary_meeting" ? (
                <MDTView formKey={form.formKey} settings={settings} />
              ) : form.formKey === "schedule_of_supports" ? (
                <ScheduleOfSupportsView formKey={form.formKey} settings={settings} />
              ) :

                form.formKey === "sa_support_coordination" ? (
                  <SASupportCoordination formKey={form.formKey} settings={settings} />
                ) : form.formKey === "conflict_of_interest" ? (
                  <ConflictOfInterestView formKey={form.formKey} settings={settings} formData={form.data} />
                ) : form.formKey === "ndis_consent" ? (
                  <NDISConsentView formKey={form.formKey} settings={settings} formData={form.data} commonFieldsData={form.commonFields} />
                ) : form.formKey === "review_of_decision" ? (
                  <ReviewOfDecisionView formKey={form.formKey} settings={settings} formData={form.data} commonFieldsData={form.commonFields} />
                ) : form.formKey === "change_of_details" ? (
                  <ChangeOfDetailsView formKey={form.formKey} settings={settings} formData={form.data} commonFieldsData={form.commonFields} />
                ) :

                  (
                    <div className="text-center py-16">
                      <div className="p-8 rounded-full bg-azure-100 w-28 h-28 mx-auto mb-4 flex items-center justify-center">
                        <FaFileAlt className="text-azure-300 text-3xl" />
                      </div>
                      <h3 className="text-xl font-bold text-azure-700 mb-2">Preview Not Available</h3>
                      <p className="text-azure-400 text-sm">This form type does not support preview yet.</p>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
