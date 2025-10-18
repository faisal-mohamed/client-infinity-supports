import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import PersonCentredPlanPDF from "@/components-server/PrintableForms/Person_Centred_Plan/PersonCentredPlanPDF_DYNAMIC";

/**
 * TEST ROUTE: Person Centred Plan Dynamic PDF Generation
 * 
 * Tests the dynamic PDF generation with varying amounts of content:
 * - Test 1: Minimal content (1 goal, 1 support)
 * - Test 2: Medium content (5 goals, 3 supports)
 * - Test 3: Maximum content (10 goals, 10 supports)
 * 
 * ✅ QUESTION SPACING RULE + UNIFORM BOX LAYOUT TESTING:
 * - Health Information section: 7 questions in bordered containers with 2-line spacing between each
 * - Goals section: N goal cards with 2-line spacing between each
 * - Informal Supports: N support rows with 2-line spacing between each
 * - No spacing after the last question in each section
 * - All health questions now have consistent blue-bordered containers
 * 
 * Access: http://localhost:3000/api/test-person-centred-plan-dynamic?test=1
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testCase = searchParams.get('test') || '2'; // Default to medium

  let testData: any = {};
  let testDescription = '';

  // Base logo (placeholder)
  const logoDataUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiIGZpbGw9IiMzYjgyZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbmZpbml0eSBTdXBwb3J0czwvdGV4dD48L3N2Zz4=";

  switch (testCase) {
    case '1':
      // TEST 1: MINIMAL CONTENT (1 goal, 1 support)
      testDescription = 'Minimal Content - 1 Goal, 1 Support';
      testData = {
        // Personal Info
        name: 'John Doe',
        address: '123 Main Street, Perth WA 6000',
        dob: '1990-01-15',
        guardian: 'Jane Doe',
        contactNumber: '0412345678',
        disability: 'Autism Spectrum Disorder',
        ndisNumber: 'NDIS12345678',
        
        // About Me
        myStory: 'I enjoy art and music. I like spending time with family and friends.',
        strengths: 'Creative, patient, good listener',
        challenges: 'Social communication',
        
        // Health - Testing Question Spacing Rule
        allergies: 'None known',
        respiratoryHistory: 'No significant respiratory issues. Regular check-ups show normal lung function.',
        precautions: 'No specific precautions required. Standard safety measures apply.',
        healthConditions: 'Generally good health. No chronic conditions requiring ongoing management.',
        companionCard: 'Yes',
        ambulanceCover: 'Yes',
        healthcarePrompt: 'No',
        
        // ONLY 1 GOAL
        goal1: 'Improve social skills by attending weekly community group',
        rating1: 'New Goal',
        actions1: 'Enroll in social skills workshop, attend weekly sessions',
        byWhom1: 'Support Worker',
        byWhen1: '2025-06-30',
        reviewDate1: '2025-12-31',
        
        // Support Info
        pbsSupportPlanIncluded: 'No',
        restrictivePractices: 'No',
        organizationName: 'Infinity Supports WA',
        contactPersonOrg: 'Sarah Smith',
        contactNumberOrg: '0498765432',
        
        // ONLY 1 INFORMAL SUPPORT
        support1: 'Mother',
        role1: 'Primary caregiver',
        frequency1: 'Daily',
      };
      break;

    case '2':
      // TEST 2: MEDIUM CONTENT (5 goals, 3 supports)
      testDescription = 'Medium Content - 5 Goals, 3 Supports';
      testData = {
        // Personal Info
        name: 'Sarah Johnson',
        address: '456 Park Avenue, Fremantle WA 6160',
        dob: '1985-03-22',
        guardian: 'Michael Johnson',
        contactNumber: '0423456789',
        disability: 'Intellectual Disability',
        ndisNumber: 'NDIS98765432',
        
        // About Me
        myStory: 'I love cooking, gardening, and spending time with animals. I want to live more independently and learn new skills. I enjoy helping others and being part of my community.',
        strengths: 'Kind, helpful, eager to learn, good with animals, enjoys routine',
        challenges: 'Reading and writing, managing money, remembering appointments',
        
        // Health - Testing Question Spacing Rule + Overflow Prevention
        allergies: 'Penicillin allergy - requires avoidance of all penicillin-based antibiotics. Also allergic to shellfish, nuts, and dairy products. Must carry EpiPen at all times.',
        respiratoryHistory: 'Mild asthma diagnosed in 2020. Uses Ventolin inhaler as needed. Peak flow monitoring twice daily. No hospitalizations for asthma. Regular pulmonary function tests show normal results.',
        precautions: 'Avoid penicillin-based medications. Carry inhaler at all times. Monitor blood sugar levels. Avoid shellfish. Regular medical check-ups required. Inform all healthcare providers of allergies.',
        healthConditions: 'Asthma (mild, well-controlled), Type 2 Diabetes (diet-controlled), Hypertension (medication-controlled), Anxiety disorder (managed with therapy)',
        companionCard: 'Yes',
        ambulanceCover: 'Yes',
        healthcarePrompt: 'Yes',
        
        // 5 GOALS
        goal1: 'Learn to cook 5 new healthy meals independently',
        rating1: 'New Goal',
        actions1: 'Weekly cooking classes, recipe cards with pictures, shopping support',
        byWhom1: 'Support Worker & OT',
        byWhen1: '2025-09-30',
        reviewDate1: '2025-12-31',
        
        goal2: 'Manage weekly budget with minimal support',
        rating2: 'Partly Achieved',
        actions2: 'Budget planner app, weekly money management sessions, practice shopping',
        byWhom2: 'Support Coordinator',
        byWhen2: '2025-08-31',
        reviewDate2: '2025-11-30',
        
        goal3: 'Volunteer at local animal shelter once per week',
        rating3: 'New Goal',
        actions3: 'Contact shelter, arrange induction, transport support',
        byWhom3: 'Support Worker',
        byWhen3: '2025-07-15',
        reviewDate3: '2025-10-15',
        
        goal4: 'Improve reading skills to read simple books',
        rating4: 'In Progress',
        actions4: 'Adult literacy classes, easy-read books, daily practice',
        byWhom4: 'Literacy Tutor',
        byWhen4: '2025-12-31',
        reviewDate4: '2026-03-31',
        
        goal5: 'Develop friendship skills and join social group',
        rating5: 'New Goal',
        actions5: 'Social skills workshop, join community group, buddy support',
        byWhom5: 'Support Worker',
        byWhen5: '2025-10-31',
        reviewDate5: '2026-01-31',
        
        // Support Info
        pbsSupportPlanIncluded: 'Yes',
        restrictivePractices: 'No',
        organizationName: 'Infinity Supports WA',
        contactPersonOrg: 'Emma Wilson',
        contactNumberOrg: '0434567890',
        
        // 3 INFORMAL SUPPORTS
        support1: 'Father (Michael)',
        role1: 'Financial support, transport to appointments',
        frequency1: 'Weekly',
        
        support2: 'Sister (Lisa)',
        role2: 'Social outings, emotional support',
        frequency2: 'Fortnightly',
        
        support3: 'Neighbor (Mrs. Brown)',
        role3: 'Emergency contact, friendly check-ins',
        frequency3: 'As needed',
      };
      break;

    case '3':
      // TEST 3: MAXIMUM CONTENT (10 goals, 10 supports)
      testDescription = 'Maximum Content - 10 Goals, 10 Supports';
      testData = {
        // Personal Info
        name: 'Alexander Thompson-Williams',
        address: '789 Riverside Drive, Unit 42, South Perth WA 6151',
        dob: '1992-11-08',
        guardian: 'Margaret Thompson-Williams',
        contactNumber: '0445678901',
        disability: 'Cerebral Palsy, Intellectual Disability, Visual Impairment',
        ndisNumber: 'NDIS11223344',
        
        // About Me (LONG TEXT to test page breaks)
        myStory: 'I have always been passionate about music and technology. Growing up, I faced many challenges due to my disabilities, but my family and support network have always believed in me. I love listening to audiobooks, playing adaptive video games, and learning about new technologies. I am particularly interested in assistive technology that can help people with disabilities live more independently. My dream is to work in the disability sector, helping others navigate their NDIS plans and find the right supports. I also enjoy spending time with my guide dog, Max, who has been my companion for the past three years. In my free time, I like to attend concerts (with accessibility accommodations), participate in online gaming communities, and learn about artificial intelligence and how it can be used to improve accessibility. I value my independence and am working toward living in my own apartment with support.',
        strengths: 'Excellent problem-solver, highly motivated, tech-savvy, good communicator (uses AAC device), resilient, empathetic, creative thinker, strong advocate for disability rights, patient, determined to achieve goals',
        challenges: 'Physical mobility (uses powered wheelchair), fine motor skills, visual impairment (uses screen reader), fatigue management, anxiety in new situations, difficulty with time management, needs support for personal care tasks, challenges with public transport navigation',
        
        // Health (LONG TEXT to test page breaks)
        allergies: 'Severe nut allergy (EpiPen required - kept in wheelchair bag), lactose intolerance, sensitivity to certain medications including NSAIDs',
        respiratoryHistory: 'Recurrent chest infections due to positioning and mobility issues. Requires regular physiotherapy and postural management. Uses breathing exercises twice daily.',
        precautions: 'Always carry EpiPen. Avoid nuts and dairy products. Regular positioning changes required (every 2 hours). Skin integrity checks daily. Ensure wheelchair is charged overnight. Fatigue management - rest breaks needed after 3-4 hours of activity. Avoid crowded spaces due to wheelchair access and anxiety. Visual aids required for written materials. Screen reader required for computer use.',
        healthConditions: 'Cerebral Palsy (spastic quadriplegia), Intellectual Disability (mild-moderate), Visual Impairment (legally blind - uses screen reader), Anxiety Disorder, Gastroesophageal Reflux Disease (GERD), Sleep Apnea (uses CPAP machine), Chronic pain management required',
        companionCard: 'Yes',
        ambulanceCover: 'Yes',
        healthcarePrompt: 'Yes - requires support for all medical appointments',
        
        // 10 GOALS (ALL FILLED)
        goal1: 'Transition to supported independent living in own apartment by end of year',
        rating1: 'New Goal',
        actions1: 'Housing search with accessibility requirements, SIL provider meetings, apartment modifications assessment, transition planning, trial overnight stays, furniture selection, establishing routines, emergency procedures training',
        byWhom1: 'Support Coordinator, OT, SIL Provider',
        byWhen1: '2025-12-31',
        reviewDate1: '2026-03-31',
        
        goal2: 'Complete Certificate II in Community Services through supported learning',
        rating2: 'In Progress',
        actions2: 'Enroll in TAFE accessible program, arrange education support worker, assistive technology setup, study schedule, assignment support, workplace experience arrangements',
        byWhom2: 'Education Support Worker, TAFE Coordinator',
        byWhen2: '2026-06-30',
        reviewDate2: '2026-09-30',
        
        goal3: 'Develop meal planning and preparation skills with adaptive equipment',
        rating3: 'Partly Achieved',
        actions3: 'OT assessment for adaptive kitchen equipment, weekly cooking sessions, recipe modification for accessibility, meal prep support, online grocery ordering training',
        byWhom3: 'Support Worker, Occupational Therapist',
        byWhen3: '2025-08-31',
        reviewDate3: '2025-11-30',
        
        goal4: 'Build confidence using public transport independently with mobility assistance',
        rating4: 'New Goal',
        actions4: 'Travel training program, route planning apps, accessible transport booking, practice journeys with support, emergency procedures, backup plans',
        byWhom4: 'Travel Trainer, Support Worker',
        byWhen4: '2025-10-31',
        reviewDate4: '2026-01-31',
        
        goal5: 'Expand social network by joining two new community groups',
        rating5: 'New Goal',
        actions5: 'Research accessible community groups, attend trial sessions, transport arrangements, social skills support, buddy system setup',
        byWhom5: 'Support Worker, Community Connector',
        byWhen5: '2025-09-30',
        reviewDate5: '2025-12-31',
        
        goal6: 'Improve money management skills including digital banking',
        rating6: 'In Progress',
        actions6: 'Accessible banking app setup with screen reader, budget planning, automated bill payments, savings goals, financial literacy workshops',
        byWhom6: 'Support Coordinator, Financial Counselor',
        byWhen6: '2025-11-30',
        reviewDate6: '2026-02-28',
        
        goal7: 'Maintain physical health through regular exercise program',
        rating7: 'Partly Achieved',
        actions7: 'Physiotherapy twice weekly, hydrotherapy sessions, adaptive gym program, wheelchair basketball trial, daily stretching routine',
        byWhom7: 'Physiotherapist, Exercise Physiologist',
        byWhen7: '2025-12-31',
        reviewDate7: '2026-03-31',
        
        goal8: 'Develop skills in assistive technology to support independence',
        rating8: 'In Progress',
        actions8: 'Voice control training, smart home setup, AAC device optimization, screen reader advanced features, tech support access',
        byWhom8: 'AT Specialist, Support Worker',
        byWhen8: '2025-10-31',
        reviewDate8: '2026-01-31',
        
        goal9: 'Establish consistent sleep routine and manage fatigue effectively',
        rating9: 'New Goal',
        actions9: 'Sleep study review, CPAP optimization, bedroom environment modifications, relaxation techniques, activity pacing strategies',
        byWhom9: 'GP, Sleep Specialist, OT',
        byWhen9: '2025-08-31',
        reviewDate9: '2025-11-30',
        
        goal10: 'Participate in NDIS advocacy and peer support as mentor',
        rating10: 'New Goal',
        actions10: 'Peer support training, join advocacy group, share lived experience, support others navigating NDIS, public speaking opportunities',
        byWhom10: 'Peer Support Coordinator, Advocacy Org',
        byWhen10: '2026-03-31',
        reviewDate10: '2026-06-30',
        
        // Support Info
        pbsSupportPlanIncluded: 'Yes - Comprehensive PBS Plan in place',
        restrictivePractices: 'No restrictive practices authorized',
        organizationName: 'Infinity Supports WA - Central Metro Region',
        contactPersonOrg: 'Rachel Green (Team Leader)',
        contactNumberOrg: '0456789012',
        
        // 10 INFORMAL SUPPORTS (ALL FILLED)
        support1: 'Mother (Margaret)',
        role1: 'Primary decision-maker, medical appointment support, emotional support, advocacy',
        frequency1: 'Daily contact, face-to-face 3x weekly',
        
        support2: 'Father (Robert)',
        role2: 'Transport support, technology assistance, financial support, maintenance of equipment',
        frequency2: 'Weekly visits, on-call for emergencies',
        
        support3: 'Sister (Emily)',
        role3: 'Social outings, peer support, technology troubleshooting, friendship',
        frequency3: 'Fortnightly visits, daily text messages',
        
        support4: 'Brother (James)',
        role4: 'Gaming companion, social connection, advocacy at community events',
        frequency4: 'Weekly online gaming, monthly outings',
        
        support5: 'Best Friend (Michael)',
        role5: 'Social support, concert companion, emotional support, shared interests',
        frequency5: 'Weekly catch-ups (virtual or in-person)',
        
        support6: 'Neighbor (Mrs. Patterson)',
        role6: 'Emergency contact, friendly check-ins, package collection',
        frequency6: 'As needed, weekly friendly chats',
        
        support7: 'Guide Dog Max',
        role7: 'Mobility assistance, companionship, emotional support',
        frequency7: 'Constant companion',
        
        support8: 'Cousin (Sarah)',
        role8: 'Social outings, advocacy, family connection',
        frequency8: 'Monthly family gatherings',
        
        support9: 'Friend from Church (David)',
        role9: 'Spiritual support, community connection, accessible transport to services',
        frequency9: 'Weekly church services, monthly social events',
        
        support10: 'Peer Mentor (Jason)',
        role10: 'NDIS navigation advice, lived experience sharing, goal-setting support',
        frequency10: 'Fortnightly peer support sessions',
      };
      break;

    default:
      return new NextResponse('Invalid test case. Use ?test=1, ?test=2, or ?test=3', { status: 400 });
  }

  try {
    // Settings
    const settings = {
      from_email: 'info@infinitysupportswa.org',
      person_centred_plan: 'PCP-2025-001',
      review_date: '2025-10-18',
    };

    // Common fields data
    const commonFieldsData = {
      name: testData.name,
      street: testData.address,
      dob: testData.dob,
      disability: testData.disability,
      ndis: testData.ndisNumber,
    };

    console.log(`🧪 TESTING: ${testDescription}`);
    console.log(`📊 Goals: ${Object.keys(testData).filter(k => k.startsWith('goal') && !k.match(/\d+(rating|actions|byWhom|byWhen|reviewDate)/)).length}`);
    console.log(`📊 Supports: ${Object.keys(testData).filter(k => k.startsWith('support') && !k.match(/\d+(role|frequency)/)).length}`);

    // Generate PDF
    const pdfDoc = React.createElement(PersonCentredPlanPDF, {
      formData: testData,
      commonFieldsData,
      settings,
      logoDataUrl
    }) as any;

    const pdfBuffer = await renderToBuffer(pdfDoc);
    const base64PDF = pdfBuffer.toString("base64");

    // Return HTML with embedded PDF viewer
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test: ${testDescription}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
              background: #f3f4f6;
            }
            .header {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            h1 {
              margin: 0 0 10px 0;
              color: #1f2937;
            }
            .test-info {
              display: flex;
              gap: 20px;
              margin-top: 15px;
            }
            .test-info div {
              background: #eff6ff;
              padding: 10px 15px;
              border-radius: 6px;
              border-left: 3px solid #3b82f6;
            }
            .test-info strong {
              color: #1e40af;
            }
            .nav {
              margin-top: 15px;
            }
            .nav a {
              display: inline-block;
              padding: 8px 16px;
              background: #3b82f6;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin-right: 10px;
              font-size: 14px;
            }
            .nav a:hover {
              background: #2563eb;
            }
            iframe {
              width: 100%;
              height: calc(100vh - 200px);
              border: 1px solid #d1d5db;
              border-radius: 8px;
              background: white;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🧪 Dynamic PDF Test: ${testDescription}</h1>
            <div class="test-info">
              <div><strong>Test Case:</strong> ${testCase}</div>
              <div><strong>Expected Behavior:</strong> Creates N pages dynamically based on content</div>
            </div>
            <div class="nav">
              <a href="?test=1">Test 1: Minimal (1 goal, 1 support)</a>
              <a href="?test=2">Test 2: Medium (5 goals, 3 supports)</a>
              <a href="?test=3">Test 3: Maximum (10 goals, 10 supports)</a>
            </div>
          </div>
          <iframe 
            src="data:application/pdf;base64,${base64PDF}" 
            title="PDF Preview"
          ></iframe>
        </body>
      </html>
      `,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (error: any) {
    console.error("Error generating test PDF:", error);
    return new NextResponse(`Error: ${error.message}\n\n${error.stack}`, { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

