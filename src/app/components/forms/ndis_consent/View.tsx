"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const PDFViewWrapper = dynamic(() => import('./PDFViewWrapper'), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center h-full p-8 text-azure-400">
            <div className="w-10 h-10 border-4 border-t-azure-600 border-azure-100 rounded-full animate-spin mb-4"></div>
            <p>Loading PDF Preview...</p>
        </div>
    ),
});

interface NDISConsentViewProps {
    formData: any;
    commonFields?: any;
    client?: {
        commonFields?: any;
        [key: string]: any;
    };
    [key: string]: any;
}

const NDISConsentView: React.FC<NDISConsentViewProps> = (props) => {
    const commonFieldsData = props.commonFieldsData || props.commonFields || props.client?.commonFields || {};

    return (
        <div className="w-full h-[calc(100vh-100px)] min-h-[600px] bg-azure-100 rounded-xl overflow-y-auto shadow-sm border border-azure-100">
            <PDFViewWrapper
                formData={props.formData || {}}
                commonFieldsData={commonFieldsData}
            />
        </div>
    );
};

export default NDISConsentView;
