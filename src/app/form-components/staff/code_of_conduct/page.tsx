"use client";
import React from "react";

interface NDISCodeOfConductProps {
  formData: {
    signature: string;
    date: string;
    position: string;
  };
}

export default function NDISCodeOfConduct({ formData }: NDISCodeOfConductProps) {
  return (
    <div className="bg-white text-black p-4">
      <div className="max-w-[650px] mx-auto border border-black">
        {/* Header */}
        <div className="flex border-b border-black">
          <div className="w-1/2 border-r border-black flex items-center justify-center p-2">
            <img
              src="/infinity_logo.png"
              alt="Infinity Supports WA logo"
              className="max-h-[80px]"
              width="150"
              height="80"
            />
          </div>
          <div className="w-1/2 bg-[#c276c0] flex items-center justify-center p-2">
            <h2 className="text-white font-bold text-lg leading-tight text-center">
              NDIS Code of Conduct
            </h2>
          </div>
        </div>

        {/* Meta */}
        <div className="flex border-t border-black text-xs">
          <div className="w-1/2 border-r border-black p-1 text-[#6b7a8f]">
            Doc No: NDIS Manual
          </div>
          <div className="w-1/4 border-r border-black p-1 text-[#6b7a8f]">
            Version No: 01
          </div>
          <div className="w-1/4 p-1 text-[#6b7a8f]">Version Date: 10/01/21</div>
        </div>

        {/* Content */}
        <div className="p-4 text-[13px] leading-relaxed">
          <p className="mb-3">
            <span className="inline-block align-top mr-1">✓</span>
            <span>
              <span className="text-red-600 font-semibold">
                Infinity Supports WA
              </span>{" "}
              and their workers are committed to following the NDIS Code of
              Conduct which is as per below:
            </span>
          </p>

          <ol className="list-decimal list-inside space-y-1 mb-4 text-[13px]">
            <li>
              Act with respect for individual rights for the freedom of
              expression, self-determination and decision-making with applicable
              laws and conventions.
            </li>
            <li>Respect the privacy of people with disability.</li>
            <li>
              Provide supports and services in a manner that is safely and
              competently, with care and skill.
            </li>
            <li>Act with integrity, honesty and transparency.</li>
            <li>
              Promptly take steps to raise and act on concerns about matters
              that may impact the quality and safety of supports and services
              provided to people with disability.
            </li>
            <li>
              Take all reasonable steps to prevent and respond to all forms of
              violence against exploitation, neglect, and abuse of people with
              disability.
            </li>
            <li>
              Take all reasonable steps to prevent and respond to sexual
              misconduct.
            </li>
          </ol>

          <p className="mb-4">
            The NDIS Commission requires{" "}
            <span className="text-red-600 font-semibold">
              Infinity Supports WA
            </span>{" "}
            to demonstrate honesty, integrity, and transparency in all their
            dealings. This extends to how they determine pricing for products
            and services offered to NDIS scheme participants, along with
            providing clear justifications for their pricing decisions.
            Additionally, providers are bound by the Australian Consumer Law
            (ACL), which prohibits misleading or deceptive conduct, false
            statements, and unfair contract terms, including those related to
            the pricing of goods and services, thus ensuring fair treatment of
            NDIS participants and plan managers.
          </p>

          <p className="mb-4">
            Price differentiation occurs when a provider charges NDIS
            participants a higher price for identical products, supports, or
            services compared to other customers. The recently updated NDIS Code
            of Conduct Provider and Worker Guidance (Guidance) (April 22nd,
            2024) recognises price differentiation as a potential form of 'sharp
            practice'. The Commission expects NDIS providers to refrain from
            engaging in or endorsing such practices. This entails:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-[13px]">
            <li>
              Avoiding charging participants more than others for essentially
              the same product, support, or service without valid justification.
            </li>
            <li>
              Abstaining from promoting, advertising, or publicizing higher
              prices for essentially the same products, supports, or services
              for participants compared to others without valid justification.
            </li>
          </ul>

          {/* Display Values */}
          <div className="flex justify-between text-[12px] font-semibold gap-4">
            <div className="flex flex-col w-1/3">
              <label className="mb-1">Signature</label>
              <div className="border border-black p-1 text-sm min-h-[28px] bg-gray-50">
                {formData?.signature}
              </div>
            </div>
            <div className="flex flex-col w-1/3">
              <label className="mb-1">Date</label>
              <div className="border border-black p-1 text-sm min-h-[28px] bg-gray-50">
                {formData?.date}
              </div>
            </div>
            <div className="flex flex-col w-1/3">
              <label className="mb-1">Position</label>
              <div className="border border-black p-1 text-sm min-h-[28px] bg-gray-50">
                {formData?.position}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
