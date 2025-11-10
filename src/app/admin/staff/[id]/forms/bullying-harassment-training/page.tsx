"use client";

import PDFFormView from '../PDFFormView';
import { useParams } from 'next/navigation';

export default function StaffBullyingHarassmentTrainingView() {
  const { id } = useParams<{ id: string }>();

  return (
    <PDFFormView
      formType="bullying-harassment-training"
      formTitle="Bullying and Harassment Training"
      apiEndpoint={`/api/staff/${id}/forms/bullying-harassment-training`}
      pdfEndpoint={`/api/staff/${id}/forms/bullying-harassment-training/pdf`}
      downloadFilename={(data) => `${data?.staff?.firstName}_${data?.staff?.surname}_bullying_harassment_training.pdf`}
    />
  );
}
