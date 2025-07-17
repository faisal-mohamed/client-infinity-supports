import React from "react";

interface A4PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const A4PageWrapper: React.FC<A4PageWrapperProps> = ({
  children,
  className = "",
}) => (
  <div
    className={`
      w-[210mm] h-[297mm] mx-auto mb-8 bg-white 
      print:shadow-none print:mb-0 print:border-none print:break-after-page
      shadow-lg border border-gray-300 
      p-[20mm] box-border flex flex-col
      ${className}
    `}
    style={{
      pageBreakAfter: "always",
      pageBreakInside: "avoid",
    }}
  >
    {children}
  </div>
);

export default A4PageWrapper;
