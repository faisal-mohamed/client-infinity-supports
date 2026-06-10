"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SignaturePad from "@/app/components/forms/SignaturePad";

type AcknowledgementMode = "hidden" | "readonly" | "editable";

interface FairWorkMeta {
  showAcknowledgement?: boolean;
  website?: string | null;
  formId?: string | null;
  reviewDate?: string | null;
  footerLeft?: string | null;
  footerCenter?: string | null;
  footerRight?: string | null;
}

interface FairWorkInformationViewProps {
  excludeLastPage?: boolean;
  children?: React.ReactNode;
  data?: any;
  meta?: FairWorkMeta;
  acknowledgementMode?: AcknowledgementMode;
  onAcknowledgementChange?: (updates: Record<string, any>) => void;
  showDocument?: boolean;
}

const PDF_URL = "/Fairwork%20Information%20Statements.pdf";

export default function FairWorkInformationView({
  excludeLastPage = false,
  children,
  data = {},
  meta,
  acknowledgementMode,
  onAcknowledgementChange,
  showDocument = true,
}: FairWorkInformationViewProps) {
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const hasRenderedRef = useRef(false);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const injectScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Avoid injecting the same script twice
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    if (!showDocument) return;
    const renderPdf = async () => {
      if (hasRenderedRef.current) return;
      hasRenderedRef.current = true;
      setIsRendering(true);
      try {
        await injectScript(
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        );
        await injectScript(
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
        );

        const w: any = window as any;
        if (!w["pdfjsLib"]) throw new Error("pdfjsLib not available");
        w["pdfjsLib"].GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        const loadingTask = w["pdfjsLib"].getDocument(PDF_URL);
        const pdf = await loadingTask.promise;

        const container = pdfContainerRef.current;
        if (!container) return;
        container.innerHTML = "";

        const containerWidth = container.clientWidth || 794;
        const devicePixelRatioValue = Math.max(window.devicePixelRatio || 1, 1);

        let maxWidth: number;
        let qualityMultiplier: number;
        if (window.innerWidth < 480) {
          maxWidth = 350;
          qualityMultiplier = 1.2;
        } else if (window.innerWidth < 768) {
          maxWidth = 450;
          qualityMultiplier = 1.5;
        } else if (window.innerWidth < 1024) {
          maxWidth = 650;
          qualityMultiplier = 1.8;
        } else if (window.innerWidth < 1440) {
          maxWidth = 850;
          qualityMultiplier = 2;
        } else {
          maxWidth = 950;
          qualityMultiplier = 2.2;
        }

        const displayWidth = Math.min(containerWidth * 0.9, maxWidth);
        const fragment = document.createDocumentFragment();
        const lastPage = excludeLastPage ? pdf.numPages - 1 : pdf.numPages;

        for (let i = 1; i <= lastPage; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({
            scale: displayWidth / page.getViewport({ scale: 1 }).width,
          });
          const outputScale = devicePixelRatioValue * qualityMultiplier;

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;

          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;
          canvas.style.display = "block";
          canvas.style.margin = "0 auto 16px auto";
          canvas.style.border = "1px solid #e5e7eb";
          canvas.style.borderRadius = "8px";
          canvas.style.boxShadow =
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
          canvas.style.backgroundColor = "white";
          canvas.style.maxWidth = "100%";

          const transform =
            outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

          await page.render({
            canvasContext: context,
            viewport,
            transform: transform as any,
          }).promise;
          fragment.appendChild(canvas);
        }

        container.appendChild(fragment);
      } catch (err: any) {
        console.error("Error rendering Fairwork Information Statements PDF:", err);
        setError(err.message || "Failed to render PDF.");
      } finally {
        setIsRendering(false);
      }
    };

    renderPdf();
  }, [excludeLastPage, showDocument]);

  const resolvedAcknowledgementMode: AcknowledgementMode = useMemo(() => {
    if (acknowledgementMode) return acknowledgementMode;
    if (meta?.showAcknowledgement === false) return "hidden";
    return "readonly";
  }, [acknowledgementMode, meta?.showAcknowledgement]);

  const derivedStaffName =
    data?.staffName ||
    data?.employeeName ||
    (data?.staff
      ? `${data.staff.firstName || ""} ${data.staff.surname || ""}`.trim()
      : "");

  const derivedSignature = data?.signature || data?.staffSignature || "";
  const derivedDate =
    data?.date ||
    data?.acknowledgedAt ||
    (data?.staffSignedAt
      ? new Date(data.staffSignedAt).toISOString().split("T")[0]
      : "");
  const derivedAcknowledged =
    data?.acknowledged ||
    data?.readAcknowledgement ||
    data?.fairworkAcknowledged ||
    false;

  const handleInputChange = (
    key: string,
    value: any,
    duplicateKeys: string[] = []
  ) => {
    onAcknowledgementChange?.(
      duplicateKeys.length
        ? duplicateKeys.reduce(
            (acc, duplicateKey) => ({ ...acc, [duplicateKey]: value }),
            { [key]: value }
          )
        : { [key]: value }
    );
  };

  const footerWebsite = meta?.website ?? meta?.footerLeft ?? "";
  const footerCenter = meta?.formId ?? meta?.footerCenter ?? "";
  const footerRight = meta?.reviewDate
    ? `Review Date: ${meta.reviewDate}`
    : meta?.footerRight ?? "";

  const renderFooter = () => {
    if (!footerWebsite && !footerCenter && !footerRight) return null;
    return (
      <div className="absolute bottom-8 left-[72px] right-[72px] text-[10pt] text-gray-600 flex items-center justify-between gap-4">
        <div>{footerWebsite}</div>
        <div>{footerCenter}</div>
        <div>{footerRight}</div>
      </div>
    );
  };

  const renderAcknowledgementSection = () => {
    if (resolvedAcknowledgementMode === "hidden") return null;

    if (resolvedAcknowledgementMode === "readonly") {
      return (
        <div className="flex justify-center w-full mt-10 font-['Open_Sans'] px-4 pb-6">
          <div className="bg-white w-full max-w-[794px] min-h-[1123px] border shadow relative px-[72px] pt-12 pb-[112px] a4-ack">
            <div className="flex justify-center mb-8">
              <img
                src="/client_full_logo.jpg"
                alt="Infinity Supports WA logo"
                className="h-16 object-contain"
              />
            </div>

            <h2 className="text-center font-semibold mb-6 text-[12pt]">
              Fairwork Information Statements Acknowledgement Form
            </h2>

            <p className="mb-4 text-[11pt] leading-relaxed">
              I confirm I have received the{" "}
              <strong>Fairwork Information Statements</strong> from Infinity
              Supports WA and have read and understood the content.
            </p>
            <p className="mb-8 text-[11pt] leading-relaxed">
              A printed version of the statements is available on request. If
              you require a printed copy, please contact Infinity Supports WA.
            </p>

            <div className="space-y-6 text-[11pt]">
              <div className="flex items-start gap-3 p-4 border border-azure-100 rounded-lg bg-gray-50">
                <input
                  id="fairworkAcknowledgementReadonly"
                  type="checkbox"
                  checked={derivedAcknowledged}
                  readOnly
                  className="mt-1 w-5 h-5 rounded border-azure-100 cursor-default x-mark"
                />
                <label
                  htmlFor="fairworkAcknowledgementReadonly"
                  className="leading-relaxed"
                >
                  <strong>I acknowledge that:</strong>
                  <br />• I have received the Fairwork Information Statements
                  from Infinity Supports WA
                  <br />• I have read and understood the content
                  <br />• I may request further clarification or copies at any
                  time
                </label>
              </div>

              <div>
                <label className="block mb-1">Name</label>
                <div className="w-full border-b border-black/60 px-1 py-2 text-gray-800 min-h-[32px]">
                  {derivedStaffName || (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-1">Signature</label>
                {derivedSignature ? (
                  <img
                    src={derivedSignature}
                    alt="Employee Signature"
                    className="border max-h-20 bg-white"
                  />
                ) : (
                  <div className="w-full border border-dashed border-azure-200 rounded-lg px-3 py-6 text-gray-400 italic">
                    No signature provided
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1">Date</label>
                <div className="w-full border-b border-black/60 px-1 py-2 text-gray-800 min-h-[32px]">
                  {derivedDate
                    ? new Date(derivedDate).toLocaleDateString("en-AU")
                    : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                </div>
              </div>
            </div>

            {renderFooter()}
          </div>
        </div>
      );
    }

  return (
      <div className="flex justify-center w-full mt-10 font-['Open_Sans'] px-4 pb-6">
        <div className="bg-white w-full max-w-[794px] min-h-[1123px] border shadow relative px-[72px] pt-12 pb-[112px] a4-ack">
          <div className="flex justify-center mb-8">
            <img
              src="/client_full_logo.jpg"
              alt="Infinity Supports WA logo"
              className="h-16 object-contain"
            />
          </div>

          <h2 className="text-center font-semibold mb-6 text-[12pt]">
            Fairwork Information Statements Acknowledgement Form
          </h2>

          <p className="mb-4 text-[11pt] leading-relaxed">
            Please confirm you have received and read the{" "}
            <strong>Fairwork Information Statements</strong>. Complete the form
            below to acknowledge receipt. All fields marked with{" "}
            <span className="text-red-500">*</span> are required.
          </p>
          <p className="mb-8 text-[11pt] leading-relaxed">
            A printed version is available on request. Contact Infinity Supports
            WA if you require a hard copy.
          </p>

          <div className="space-y-6 text-[11pt]">
            <div className="flex items-start gap-3 p-4 border border-azure-100 rounded-lg bg-gray-50">
              <input
                id="fairworkAcknowledgementEditable"
                type="checkbox"
                checked={!!derivedAcknowledged}
                onChange={(e) =>
                  handleInputChange("acknowledged", e.target.checked, [
                    "readAcknowledgement",
                    "fairworkAcknowledged",
                  ])
                }
                className="mt-1 w-5 h-5 rounded border-azure-100 x-mark"
              />
              <label
                htmlFor="fairworkAcknowledgementEditable"
                className="leading-relaxed"
              >
                <strong>I acknowledge that:</strong>
                <br />• I have received the Fairwork Information Statements from
                Infinity Supports WA
                <br />• I have read and understood the content
                <br />• I may request further clarification or copies at any
                time
              </label>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={derivedStaffName}
                readOnly
                disabled
                className="w-full border border-azure-100 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed opacity-70"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">
                Signature <span className="text-red-500">*</span>
              </label>
              <SignaturePad
                onEnd={(value) =>
                  handleInputChange("signature", value, ["staffSignature"])
                }
                initialValue={derivedSignature}
              />

            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-800">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={derivedDate || ""}
                onChange={(e) =>
                  handleInputChange("date", e.target.value, [
                    "acknowledgedAt",
                    "staffSignedAt",
                  ])
                }
                className="w-full border border-azure-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
              />
            </div>
          </div>

          {renderFooter()}
        </div>
      </div>
    );
  };

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="w-full flex justify-center p-2 md:p-4">
      <div className="w-full max-w-6xl mx-auto">
        {showDocument && (
          <>
            {isRendering && (
              <div className="text-center text-gray-500 mb-4">Loading PDF...</div>
            )}
            <div
              ref={pdfContainerRef}
              className="pdf-container flex flex-col items-center justify-center"
              style={{
                gap: "16px",
                padding: "20px 0",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            ></div>
          </>
        )}

        {renderAcknowledgementSection()}

        {children}
      </div>
    </div>
  );
}


