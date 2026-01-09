"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the wrapper component that handles all PDF logic
// This effectively isolates @react-pdf/renderer from the server bundle
const PDFViewWrapper = dynamic(() => import('./PDFViewWrapper'), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
            <div className="w-10 h-10 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mb-4"></div>
            <p>Loading PDF Preview...</p>
        </div>
    ),
});

interface ConflictOfInterestViewProps {
    formData: any;
    commonFields?: any;
    client?: {
        commonFields?: any;
        [key: string]: any;
    };
    [key: string]: any;
}

const ConflictOfInterestView: React.FC<ConflictOfInterestViewProps> = (props) => {
    // Attempt to resolve common fields from various possible prop locations
    const commonFieldsData = props.commonFieldsData || props.commonFields || props.client?.commonFields || {};

    return (
        <div className="w-full h-[calc(100vh-100px)] min-h-[600px] bg-gray-100 rounded-xl overflow-y-auto shadow-sm border border-gray-200">
            <PDFViewWrapper
                formData={props.formData || {}}
                commonFieldsData={commonFieldsData}
            />
        </div>
    );
};

export default ConflictOfInterestView;
