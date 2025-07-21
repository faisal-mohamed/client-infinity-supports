import React from 'react'
import Page1 from './page1'


 const formSchema : any  = {
  title: "Multi-Disciplinary Meeting",
  fields: [
    { key: "clientName", label: "Client Name" },
    { key: "date", label: "Date" },
    { key: "inAttendance", label: "In Attendance" },
    { key: "apologies", label: "Apologies" },
    { key: "introduction", label: "Introduction" },
    { key: "physiotherapy", label: "Physiotherapy" },
    { key: "ot", label: "OT" },
    { key: "speech", label: "Speech" },
    { key: "pbs", label: "PBS" },
    { key: "serviceDelivery", label: "Service Delivery" },
    { key: "family", label: "Family" },
    { key: "recommendations", label: "Recommendations" },
    { key: "nextMeetingNote", label: "Meeting Close Note" }
  ]
};


// export const formData = {
//   clientName: "John Doe",
//   date: "2025-07-19",
//   inAttendance: "Dr. Smith, OT Jane, Physio Alex",
//   apologies: "Speech Therapist unavailable",
//   introduction: "Initial case summary presented by coordinator.",
//   physiotherapy: "Reviewed current mobility challenges and exercises.",
//   ot: "Focused on fine motor skill improvements.",
//   speech: "Working on articulation and comprehension tasks.",
//   pbs: "Developing plan for behavioral support intervention.",
//   serviceDelivery: "Team agreed on weekly visits and coordination.",
//   family: "Parents engaged and supportive of proposed strategies.",
//   recommendations: "Increase OT sessions. Revisit plan in 2 weeks.",
//   nextMeetingNote: "I will schedule the next meeting for 05/08/2025."
// };




const MDT = ({formData, commonFieldsData, settings} : any ) => {
  return (
    <div>
        <Page1  schema={formSchema} data={formData} commonFieldsData={commonFieldsData} settings={settings} />
    </div>
  )
}

export default MDT