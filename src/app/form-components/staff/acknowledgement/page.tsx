"use client";
import React from "react";

export default function DocumentationAcknowledgement(props: any = {}) {
  const formData = props.formData || {};
  return (
    <div className="bg-white min-h-screen flex justify-center items-start pt-10 px-4 font-['Open_Sans']">
      <div className="max-w-3xl w-full">
        <div className="flex justify-center mb-6">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo with stylized infinity symbol in pink above the text 'Infinity Supports WA' and tagline 'Achieving Goals and Beyond' in smaller pink text below"
            className="w-[200px] h-[80px] object-contain"
            width={200}
            height={80}
          />
        </div>

        <p className="font-semibold text-base mb-4">
          Documentation Acknowledgement
        </p>
        <p className="mb-4">
          I confirm I have received copies of the following documents from
          Infinity Supports WA.
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>First aid policy</li>
          <li>Vehicle safety policy</li>
          <li>Vehicle safety inspection checklist</li>
          <li>Training on bullying and harassment</li>
        </ul>
        <p className="mb-4">
          Copies of the same documents are available on{" "}
          <a
            className="text-azure-700 underline"
            href="http://www.infinitysupportswa.org"
            target="_blank"
          >
            www.infinitysupportswa.org
          </a>{" "}
          and could also be requested via email. I have read and understood the
          contents of these documents.
        </p>
        <p className="mb-4">I also confirm that,</p>
        <ul className="list-disc list-inside mb-10 space-y-3">
          <li>
            I will conduct vehicle safety inspection as per the checklist
            provided by Infinity Supports WA at the start of each working day.
          </li>
          <li>
            I will ensure that my driving license is valid, vehicle used for
            work purposes is registered, comprehensively insured and
            mechanically sound.
          </li>
          <li>
            I understand that I will be provided with a first aid kit to be
            always kept in my vehicle and the onus is on me to inform management
            should any contents of the first aid kits expire.
          </li>
          <li>I will work in compliance with NDIS code of conduct.</li>
        </ul>

        <p className="mb-12">
          Staff Name: {formData.staffName || "____________________________"}
        </p>
        <p className="mb-12">
          Signature: {formData.signature || "____________________________"}
        </p>
        <p>Date: {formData.date || "_______________"}</p>
      </div>
    </div>
  );
}
