export const RISK_LEVEL_DETAILS: any = {
  Low: {
    level: "Low",
    description: `Participants have a 
low reliance on 
provider services to 
meet daily living 
needs.`,
    criteria: `Participants can 
independently perform 
most daily living activities 
without assistance. Any 
disruptions in services 
would have minimal impact 
on their overall well-being. `,
    impact: `Disruptions in services 
would have minimal 
impact on participants' 
health and safety, as they 
can manage most 
activities independently. `,
  },
  Moderate: {
    level: `Moderate`,
    description: `Participants have a 
moderate reliance on 
provider services for 
certain daily living 
needs. `,
    criteria: `Participants can perform 
some daily activities 
independently but rely on 
the provider for specific 
tasks such as 
transportation, meal 
preparation, or medication 
management. A disruption n services could moderately 
affect their overall 
well-being`,
    impact: `Disruptions in services 
could moderately impact 
participants' health and 
safety, particularly for tasks they rely on the 
provider to assist with. `
  },
  High: {
    level: "High",
    description: `Participants have a 
high reliance on 
provider services to 
meet essential daily 
living needs. `,
    criteria: `Participants require 
significant assistance from 
the provider for activities of 
daily living, including 
personal care, mobility, 
meal preparation, and 
medication management. A disruption in services would 
have a significant impact on 
their overall well-being and 
quality of life.`,
    impact: `Disruptions in services 
would significantly impact 
participants' health and 
safety, as they rely heavily 
☐ 
on the provider for 
essential tasks. There 
could be risks related to personal care, medical 
needs, and more.`,
  },
  Critical: {
    level: "Critical",
    description: `Participants have a 
critical reliance on 
provider services for 
all daily living needs.`,
    criteria: `Participants are entirely 
dependent on the provider 
for all activities of daily 
living, including personal 
care, mobility, 
communication, medical 
support, and more. Any 
disruption in services would 
pose a severe and 
immediate threat to their 
health and well-being.`,
    impact: `Disruptions in services 
would pose a critical 
threat to participants' 
health and safety. Their 
complete dependency on 
the provider means that 
any interruption could 
lead to life-threatening 
situations. `,
  },

};

export const RISK_TEMPLATES = [
  {
    issue: "Minor",
    control: "The client is a minor and may not have the skills to maintain safety in the community. The client requires support at all times and must not be left alone. All individual activities must be assessed for safety."
  },
  {
    issue: "Financial",
    control: "The client has little to no understanding of money or personal security and may leave their bag unattended. The client requires support to learn safety strategies to keep themselves and their belongings safe."
  },
  {
    issue: "Falls / Mobility",
    control: "The client requires the use of a four-wheel walker at all times. Staff are to support the client to navigate obstacles using verbal and physical prompts."
  },
  {
    issue: "Comprehension",
    control: "The client may struggle to understand people in the community. Staff are to advocate for the client if they are unable to process incoming information."
  },
  {
    issue: "Communication",
    control: "Support Workers (SW) are to assist the client to communicate with members of the public. SW are to advocate when the client is unable to communicate their needs. The client uses short, simple words and can follow simple instructions."
  },
  {
    issue: "Isolation",
    control: "The client is at risk of social isolation. Staff or the Service Manager are to check in weekly. If there is no response or concerns arise, a visual welfare check is to be completed."
  },
  {
    issue: "Meal Management",
    control: "Staff are to follow the Meal Management Plan and hold a signed copy confirming they have read and understood it. Any concerns are to be reported to management."
  },
  {
    issue: "Noise and Crowds",
    control: "The client may use headphones and their iPad when overwhelmed by noise or crowds. The client may remove themselves from the situation without informing staff."
  },
  {
    issue: "Road Safety",
    control: "The client has limited understanding of road safety and may not follow instructions near roads. Staff are to provide verbal and/or physical guidance to ensure safety."
  },
  {
    issue: "Vision",
    control: "The client has XXXX, which affects their vision. Staff are to leave items where they are found, as the client relies on routines and familiarity with item locations."
  },
  {
    issue: "Hearing",
    control: "The client wears hearing aids. Staff are to support the client with any hearing-related communication difficulties."
  },
  {
    issue: "Personal Care",
    control: "A staff member is required to be present while the client is showering."
  },
  {
    issue: "Seizures",
    control: "Follow the seizure management plan."
  },
  {
    issue: "Anaphylaxis",
    control: "Follow the anaphylaxis management plan."
  },
  {
    issue: "Skin Integrity",
    control: "Daily skin checks are required. Any concerns must be reported to the client’s family and manager."
  },
  {
    issue: "Fire & Evacuation",
    control: "A Fire and Evacuation Plan is in place and developed with the client to ensure understanding and choice. Plans are reviewed regularly, drills are completed, and records maintained on the audit register. A copy is available on ShiftCare."
  },
  {
    issue: "Overspending of Funds",
    control: "The Support Coordinator is to review budgets monthly to ensure providers are charging the correct budgets for approved services."
  },
  {
    issue: "Underspending of Funds",
    control: "The Support Coordinator is to support the client to use funding appropriately and access required disability-related services."
  },
  {
    issue: "Use of Private / Unregistered Providers",
    control: "The Support Coordinator is to vet all private workers or providers to ensure compliance with NDIS Quality Standards, including valid NDIS Worker Screening and WWC checks."
  },
  {
    issue: "Provider Ending Services",
    control: "The Support Coordinator is to ensure correct notice periods are provided so alternative providers can be arranged without service disruption."
  },
  {
    issue: "Service Agreements",
    control: "The Support Coordinator is to ensure a signed Service Agreement or written contract is in place and provided to the client. The Support Coordinator will also mediate any concerns between the client and providers."
  },
  {
    issue: "Explanation of NDIS Plan",
    control: "The Support Coordinator is to ensure the client understands their NDIS Plan and that funds are used in line with the NDIS Price Guide."
  }
];
