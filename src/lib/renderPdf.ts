import { readFileSync } from "fs";
import path from "path";
import React from "react";

export async function generateHTML(formData: any, uiSchema: any) {
  const ReactDOMServer = await import("react-dom/server");
  const { default: PrintableForm } = await import("@/components-server/PrintableForms/ClientIntakeForm");

  const element = React.createElement(PrintableForm, { formData, uiSchema });
  const renderedForm = ReactDOMServer.renderToString(element);

  // ✅ Load Tailwind build from local minified CSS
  const tailwindCss = readFileSync(path.resolve("public/tailwind-pdf.min.css"), "utf8");

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Client Intake Form</title>
        <style>${tailwindCss}</style>
        <style>
          @page { size: A4; margin: 1cm; }
          body { font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 0; }
          .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
        </style>
      </head>
      <body>
        ${renderedForm}
      </body>
    </html>
  `;

  return fullHtml;
}
