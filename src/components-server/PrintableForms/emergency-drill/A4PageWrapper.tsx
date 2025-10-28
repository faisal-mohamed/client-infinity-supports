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
      a4-page
      ${className}
    `}
    style={{
      pageBreakInside: "avoid",
      width: "210mm",
      height: "297mm",
      display: "flex",
      flexDirection: "column",
      background: "white",
      margin: "0 auto",
      padding: "20mm",
      boxSizing: "border-box"
    }}
  >
    {children}
  </div>
);

export default A4PageWrapper;
