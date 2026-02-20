import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font
} from '@react-pdf/renderer';
import { NDISHeader, ndisCommonStyles as commonStyles, NDIS_PURPLE } from './common/NDIS_Common';

// Register Deja Vu Sans font (official look)
Font.register({
    family: 'DejaVuSans',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf', fontWeight: 'bold' },
        { src: 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Oblique.ttf', fontStyle: 'italic' },
        { src: 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-BoldOblique.ttf', fontWeight: 'bold', fontStyle: 'italic' },
    ]
});

const styles = StyleSheet.create({
    page: {
        paddingTop: 25,
        paddingBottom: 70, // More bottom padding for our custom footer
        paddingHorizontal: 40,
        fontFamily: 'DejaVuSans',
        fontSize: 10,
        color: '#000000',
    },
    titleUnderline: {
        borderBottomWidth: 1.2,
        borderBottomColor: '#000000',
        paddingBottom: 6,
        marginBottom: 15,
        marginTop: 5,
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: NDIS_PURPLE,
        marginTop: 10,
        marginBottom: 5,
    },
    bodyText: {
        fontSize: 10,
        lineHeight: 1.5,
        marginBottom: 8,
        color: '#000000',
    },
    bold: {
        fontWeight: 'bold',
    },
    purple: {
        color: NDIS_PURPLE,
    },
    table: {
        width: '100%',
        marginBottom: 15,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.8,
        borderBottomColor: '#000000',
        borderLeftWidth: 0.8,
        borderLeftColor: '#000000',
        borderRightWidth: 0.8,
        borderRightColor: '#000000',
        minHeight: 25,
    },
    tableRowLast: {
        flexDirection: 'row',
        minHeight: 25,
        borderLeftWidth: 0.8,
        borderLeftColor: '#000000',
        borderRightWidth: 0.8,
        borderRightColor: '#000000',
        borderBottomWidth: 0.8,
        borderBottomColor: '#000000',
    },
    tableCellLabel: {
        width: '35%',
        padding: 5,
        backgroundColor: '#F3F4F6',
        borderRightWidth: 0.8,
        borderRightColor: '#000000',
        fontSize: 10,
        justifyContent: 'center',
    },
    tableCellValue: {
        width: '65%',
        padding: 5,
        fontSize: 10,
        justifyContent: 'center',
        color: '#666', // Placeholder style for empty values if needed
    },
    tableCellValueActual: {
        color: '#000',
    },
    footer: {
        position: 'absolute',
        bottom: 25,
        left: 40,
        right: 40,
        fontSize: 9,
        color: '#000',
        fontFamily: 'DejaVuSans',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    footerBottom: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 2,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    checkbox: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: '#000',
        marginRight: 8,
        marginTop: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkMark: {
        fontSize: 8,
        fontWeight: 'bold',
    }
});

const NDISFooter = ({ totalPages = 8 }: { totalPages?: number }) => (
    <View style={styles.footer} fixed>
        <View style={styles.footerRow}>
            <Text>V3.0 2022-06-30</Text>
            <Text>Form Change of Details or Change of Situation</Text>
            <Text render={({ pageNumber }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
        <Text style={styles.footerBottom}>This document is uncontrolled when printed</Text>
    </View>
);

const ChangeOfDetailsPDF: React.FC<any> = ({ formData = {}, commonFieldsData = {} }) => {

    const getFieldValue = (key: string) => {
        // Date Formatting
        if (key.toLowerCase().includes('date') || key.toLowerCase().includes('dob')) {
            let val = formData?.[key];
            if (!val) {
                if (key === 'dob') val = formData?.dob || commonFieldsData?.dob || commonFieldsData?.dateOfBirth;
            }

            if (!val) return '';

            // Format YYYY-MM-DD to DD/MM/YYYY
            if (val.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const [y, m, d] = val.split('-');
                return `${d}/${m}/${y}`;
            }
            return val;
        }

        return formData?.[key] || commonFieldsData?.[key] || '';
    };

    const isChecked = (field: string, option: string) => {
        const val = formData[field];
        if (Array.isArray(val)) return val.includes(option);
        return val === option;
    };

    const CheckBox = ({ selected }: { selected: boolean }) => (
        <View style={styles.checkbox}>
            {selected && <Text style={styles.checkMark}>X</Text>}
        </View>
    );

    const FormRow = ({ label, value, isLast = false }: { label: string, value: any, isLast?: boolean }) => (
        <View style={isLast ? styles.tableRowLast : styles.tableRow} wrap={false}>
            <View style={styles.tableCellLabel}><Text>{label}</Text></View>
            <View style={styles.tableCellValue}>
                <Text style={value ? styles.tableCellValueActual : {}}>{value || 'Click or tap here to enter text.'}</Text>
            </View>
        </View>
    );

    return (
        <Document>
            {/* Page 1: Instructions */}
            <Page size="A4" style={styles.page}>
                <NDISHeader />
                <View style={styles.titleUnderline}>
                    <Text style={styles.mainTitle}>Change of Details or Change of Situation</Text>
                </View>

                <Text style={styles.bodyText}>You can use this form to let us know if:</Text>
                <View style={{ marginLeft: 20 }}>
                    <Text style={styles.bodyText}>• Your details have changed. You can change your contact details or who you give consent to at any time.</Text>
                    <Text style={styles.bodyText}>• You want to change something in your current plan, for example how funding in your plan is managed.</Text>
                    <Text style={styles.bodyText}>• Your situation has changed and your plan no longer meets your disability support needs so you want a new plan.</Text>
                </View>

                <Text style={styles.bodyText}>
                    When you ask us to change your plan we call this a <Text style={styles.bold}>participant requested plan change</Text>. Depending on what’s changed for you, we may be able to work with you to change your current plan. We call this a <Text style={styles.bold}>plan variation</Text>.
                </Text>

                <Text style={styles.bodyText}>
                    Or we may need to create a new plan with you. We call this a <Text style={styles.bold}>plan reassessment</Text>.
                </Text>

                <Text style={styles.bodyText}>
                    We generally won’t change your plan if you want more funding because you’ve used all the funding in the plan, or you want the same supports others have received.
                </Text>

                <Text style={styles.bodyText}>
                    If there are significant changes to your situation, such as starting work for the first time or moving out of home, we might need to do a plan reassessment and create a new plan.
                </Text>

                <Text style={styles.bodyText}>
                    For a plan reassessment you’ll need to give us any new information to help us decide if we need to reassess your plan this may include any assessments, reports or other information. <Text style={styles.bold}>Please send this information to us with this form.</Text>
                </Text>

                <Text style={styles.bodyText}>
                    Check the ‘Our Guidelines’ website (<Text style={{ color: 'blue', textDecoration: 'underline' }}>ourguidelines.ndis.gov.au</Text>) to get more information about when you need to tell us about changes in your life. Select ‘<Text style={styles.bold}>Your Plan</Text>’ and ‘<Text style={styles.bold}>Changing Your Plan</Text>’ to read more.
                </Text>

                <Text style={[styles.sectionTitle, styles.purple]}>How to use this form:</Text>
                <Text style={styles.bodyText}>
                    If you are the <Text style={styles.bold}>applicant, participant or authorised representative</Text>, please complete <Text style={styles.bold}>Part A, Part C</Text>, and <Text style={styles.bold}>Part I</Text>.
                </Text>

                <Text style={styles.bodyText}>
                    You can ask someone to complete this form for you, however you must provide consent before they can. You can provide consent by:
                </Text>
                <View style={{ marginLeft: 20 }}>
                    <Text style={styles.bodyText}>• Calling us</Text>
                    <Text style={styles.bodyText}>• Sending us a letter or email</Text>
                </View>

                <NDISFooter />
            </Page>

            {/* Page 2: Return Instructions & Part A */}
            <Page size="A4" style={styles.page}>
                <NDISHeader />
                <View style={{ marginLeft: 20, marginBottom: 10 }}>
                    <Text style={styles.bodyText}>• Sending us a completed <Text style={{ color: 'blue', textDecoration: 'underline' }}>Consent for a Third Party to Act on Behalf of a Person form</Text> from the ‘<Text style={styles.bold}>Consent forms</Text>’ website.</Text>
                </View>
                <Text style={styles.bodyText}>
                    When we have consent from you they can complete <Text style={styles.bold}>Part A, Part B, Part C</Text>, and <Text style={styles.bold}>Part I</Text> for you. We can’t accept a form from someone who fills it in for you without your consent.
                </Text>

                <Text style={[styles.sectionTitle, styles.purple]}>How Do I Return This Form To The NDIA?</Text>
                <Text style={styles.bodyText}>You can return this form to us by:</Text>
                <View style={{ marginLeft: 20 }}>
                    <Text style={styles.bodyText}>• <Text style={styles.bold}>Email:</Text> <Text style={{ color: 'blue', textDecoration: 'underline' }}>enquiries@ndis.gov.au</Text></Text>
                    <Text style={styles.bodyText}>• <Text style={styles.bold}>Mail:</Text> NDIA, GPO Box 700, Canberra ACT 2601</Text>
                    <Text style={styles.bodyText}>• <Text style={styles.bold}>In Person:</Text> Visit a <Text style={[styles.bold, styles.purple]}>Local Area Coordinator, Early Childhood Partner</Text> or <Text style={[styles.bold, styles.purple]}>NDIS Office</Text> in your area.</Text>
                </View>

                <Text style={styles.bodyText}>
                    This form is one way you can tell us what’s changed. If you prefer, you can tell us by contacting us in any of the ways listed above.
                </Text>
                <Text style={styles.bodyText}>
                    If you would like us to consider any <Text style={styles.bold}>new information or evidence</Text>, such as medical or therapy reports, please wait until you have them and send them with this form.
                </Text>

                <Text style={[styles.sectionTitle, styles.purple]}>Next Steps</Text>
                <Text style={styles.bodyText}>Once we receive your form, we will:</Text>
                <View style={{ marginLeft: 20 }}>
                    <Text style={styles.bodyText}>• Let you know if we have approved your request for a change to your plan and if we are doing a plan variation or a plan reassessment</Text>
                    <Text style={styles.bodyText}>or we will</Text>
                    <Text style={styles.bodyText}>• Contact you to discuss.</Text>
                </View>

                <Text style={styles.bodyText}>
                    If you ask for a plan change, we need to decide within <Text style={styles.bold}>21 days</Text> of receiving this form if we will do this. Once we have made a decision we will let you know in writing.
                </Text>

                <Text style={[styles.sectionTitle, styles.purple, { marginTop: 15 }]}>Part A: Person’s Details</Text>
                <Text style={styles.bodyText}>Please complete <Text style={styles.bold}>Part A</Text> with the details of the participant or applicant</Text>

                <View style={[styles.table, { marginTop: 5 }]}>
                    <FormRow label="Full Name" value={getFieldValue('fullName')} />
                    <FormRow label="Date Of Birth" value={getFieldValue('dob')} />
                    <FormRow label="NDIS Number" value={getFieldValue('ndisNumber')} />
                    <FormRow label="Preferred Contact Details (Phone Number, Email Address, Etc.)" value={getFieldValue('contactDetails')} isLast={true} />
                </View>

                <NDISFooter pageNumber={2} />
            </Page>

            {/* Page 3: Part B & Part C */}
            <Page size="A4" style={styles.page}>
                <NDISHeader />
                <Text style={[styles.sectionTitle, styles.purple]}>Part B: Third Party Details</Text>
                <Text style={styles.bodyText}>Please complete <Text style={styles.bold}>Part B</Text> if you are completing this form on behalf of the participant or applicant.</Text>

                <Text style={styles.bodyText}>You can complete this form for someone else if you can provide evidence that:</Text>
                <View style={{ marginLeft: 20 }}>
                    <Text style={styles.bodyText}>• You have <Text style={styles.bold}>parental responsibility</Text> for them;</Text>
                    <Text style={styles.bodyText}>• You are their <Text style={styles.bold}>legally authorised representative or legal guardian</Text>; or</Text>
                    <Text style={styles.bodyText}>• The participant or authorised representative has provided consent for you to do so (see <Text style={{ color: 'blue', textDecoration: 'underline' }}>How to use this form</Text>).</Text>
                </View>
                <Text style={[styles.bodyText, { marginBottom: 15 }]}>If we already have this evidence you do not need to send it with this form.</Text>

                <View style={styles.table}>
                    <FormRow label="Full Name" value={getFieldValue('thirdPartyName')} />
                    <FormRow label="Date of Birth" value={getFieldValue('thirdPartyDob')} />
                    <FormRow label="Contact Phone Number" value={getFieldValue('thirdPartyPhone')} />
                    <FormRow label="Relationship to Person in Part A (e.g. child representative, advocate, nominee)" value={getFieldValue('thirdPartyRelationship')} isLast={true} />
                </View>

                <Text style={[styles.sectionTitle, styles.purple, { marginTop: 15 }]}>Part C: Information About What Has Changed</Text>
                <Text style={styles.bodyText}>Please complete <Text style={styles.bold}>Part C</Text> to give us more information about the reason for your request.</Text>
                <Text style={styles.bodyText}>Mark the boxes that apply to you.</Text>

                <View style={{ marginTop: 10 }}>
                    {[
                        "My contact details have changed – Go to Part D",
                        "My plan has an error – Go to Part E",
                        "I would like the reassessment date of my plan changed – Go to Part F",
                        "I want to change how the funding is managed in my plan – Go to Part G",
                        "My situation has changed – Go to Part H"
                    ].map(opt => (
                        <View key={opt} style={styles.checkboxRow}>
                            <CheckBox selected={isChecked("changes", opt)} />
                            <Text style={styles.bodyText}>{opt}</Text>
                        </View>
                    ))}
                </View>

                <NDISFooter pageNumber={3} />
            </Page>

            {/* Page 4: Part D & Part E & Part F */}
            <Page size="A4" style={styles.page}>
                <NDISHeader />

                <View wrap={false}>
                    <Text style={[styles.sectionTitle, styles.purple]}>Part D: Your Contact Details Have Changed</Text>
                    <Text style={styles.bodyText}>Please complete <Text style={styles.bold}>Part D</Text> if your contact details have changed.</Text>

                    <View style={styles.table}>
                        <FormRow label="New Address (Include number, street, suburb, state, postcode and country.)" value={getFieldValue('newAddress')} />
                        <FormRow label="New Phone Number" value={getFieldValue('newPhone')} />
                        <FormRow label="New Email" value={getFieldValue('newEmail')} />

                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Permanent Or Temporary Change</Text></View>
                            <View style={styles.tableCellValue}>
                                <View style={styles.checkboxRow}>
                                    <CheckBox selected={formData.changeType === "Permanent"} />
                                    <Text style={styles.bodyText}>Permanent</Text>
                                </View>
                                <View style={styles.checkboxRow}>
                                    <CheckBox selected={formData.changeType === "Temporary"} />
                                    <Text style={styles.bodyText}>Temporary.</Text>
                                </View>
                            </View>
                        </View>

                        <FormRow label="Start Date" value={getFieldValue('partD_startDate')} />
                        <FormRow label="End Date (Temporary Changes Only)" value={getFieldValue('partD_endDate')} isLast={true} />
                    </View>
                </View>

                <View wrap={false} style={{ marginTop: 10 }}>
                    <Text style={[styles.sectionTitle, styles.purple]}>Part E: My Plan Has An Error</Text>
                    <Text style={styles.bodyText}>Please complete <Text style={styles.bold}>Part E</Text> if your plan has an error.</Text>

                    <View style={styles.table}>
                        <View style={styles.tableRowLast}>
                            <View style={styles.tableCellLabel}><Text>Describe The Error</Text></View>
                            <View style={[styles.tableCellValue, { minHeight: 80 }]}>
                                <Text style={formData.errorDescription ? styles.bodyText : { color: '#666' }}>
                                    {getFieldValue('errorDescription') || 'Click or tap here to enter text.'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View wrap={false} style={{ marginTop: 10 }}>
                    <Text style={[styles.sectionTitle, styles.purple]}>Part F: I Would Like The Reassessment Date Of My Plan Changed</Text>
                    <Text style={styles.bodyText}>Please complete <Text style={styles.bold}>Part F</Text> if you would like your reassessment date changed.</Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>How Would You Like Your Reassessment Date Changed?</Text></View>
                            <View style={styles.tableCellValue}>
                                <View style={styles.checkboxRow}>
                                    <CheckBox selected={isChecked("reassessmentDateType", "Extended")} />
                                    <Text style={styles.bodyText}>Extended</Text>
                                </View>
                                <View style={styles.checkboxRow}>
                                    <CheckBox selected={isChecked("reassessmentDateType", "Shortened")} />
                                    <Text style={styles.bodyText}>Shortened.</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.tableRowLast}>
                            <View style={styles.tableCellLabel}><Text>Describe Why Your Reassessment Date Needs Changing</Text></View>
                            <View style={[styles.tableCellValue, { minHeight: 80 }]}>
                                <Text style={formData.reassessmentReason ? styles.bodyText : { color: '#666' }}>
                                    {getFieldValue('reassessmentReason') || 'Click or tap here to enter text.'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <NDISFooter pageNumber={4} />
            </Page>

            {/* Page 5: Part G & Part H */}
            <Page size="A4" style={styles.page}>
                <NDISHeader />

                <View wrap={false}>
                    <Text style={[styles.sectionTitle, styles.purple]}>Part G: I Want To Change How The Funding Is Managed In My Plan</Text>
                    <Text style={styles.bodyText}>Please complete <Text style={styles.bold}>Part G</Text> to describe how you would like the funding managed in your plan.</Text>

                    <View style={styles.table}>
                        {/* Registered Plan Manager */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}>
                                <Text style={styles.bold}>I would like a registered plan manager to manage these supports:</Text>
                                <Text style={{ marginTop: 5, fontSize: 8 }}>Please note:</Text>
                                <Text style={{ fontSize: 8 }}>You’ll need to agree to provide your registered plan manager with a copy of your plan.</Text>
                            </View>
                            <View style={styles.tableCellValue}>
                                <View style={styles.checkboxRow}>
                                    <CheckBox selected={isChecked("rpm_Managed", "All supports")} />
                                    <Text style={styles.bodyText}>All supports</Text>
                                </View>
                                <View style={styles.checkboxRow}>
                                    <CheckBox selected={isChecked("rpm_Managed", "Specific supports - please list supports below:")} />
                                    <Text style={styles.bodyText}>Specific supports - please list supports below:</Text>
                                </View>
                                <Text style={[styles.bodyText, { marginLeft: 20, color: formData.rpm_Details ? '#000' : '#666' }]}>
                                    {getFieldValue('rpm_Details') || 'Click or tap here to enter text.'}
                                </Text>
                            </View>
                        </View>

                        {/* Self-Manage */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}>
                                <Text style={styles.bold}>I would like to self-manage these supports:</Text>
                            </View>
                            <View style={styles.tableCellValue}>
                                <View style={styles.checkboxRow}>
                                    <CheckBox selected={isChecked("sm_Managed", "All supports")} />
                                    <Text style={styles.bodyText}>All supports</Text>
                                </View>
                                <View style={styles.checkboxRow}>
                                    <CheckBox selected={isChecked("sm_Managed", "Specific supports - please list supports below:")} />
                                    <Text style={styles.bodyText}>Specific supports - please list supports below:</Text>
                                </View>
                                <Text style={[styles.bodyText, { marginLeft: 20, color: formData.sm_Details ? '#000' : '#666' }]}>
                                    {getFieldValue('sm_Details') || 'Click or tap here to enter text.'}
                                </Text>
                            </View>
                        </View>

                        {/* Agency */}
                        <View style={styles.tableRowLast}>
                            <View style={styles.tableCellLabel}>
                                <Text style={styles.bold}>I would like the Agency to manage these supports:</Text>
                            </View>
                            <View style={styles.tableCellValue}>
                                <View style={styles.checkboxRow}>
                                    <CheckBox selected={isChecked("agency_Managed", "All supports")} />
                                    <Text style={styles.bodyText}>All supports</Text>
                                </View>
                                <View style={styles.checkboxRow}>
                                    <CheckBox selected={isChecked("agency_Managed", "Specific supports - please list supports below:")} />
                                    <Text style={styles.bodyText}>Specific supports - please list supports below:</Text>
                                </View>
                                <Text style={[styles.bodyText, { marginLeft: 20, color: formData.agency_Details ? '#000' : '#666' }]}>
                                    {getFieldValue('agency_Details') || 'Click or tap here to enter text.'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View wrap={false} style={{ marginTop: 10 }}>
                    <Text style={[styles.sectionTitle, styles.purple]}>Part H: My Situation Has Changed</Text>
                    <Text style={styles.bodyText}>Please complete <Text style={styles.bold}>Part H</Text> to let us know if your situation has changed.</Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Type Of Change - Select Any That Apply</Text></View>
                            <View style={styles.tableCellValue}>
                                {[
                                    "There have been small changes to my situation",
                                    "There have been large changes to my situation",
                                    "I need more or different supports urgently"
                                ].map(opt => (
                                    <View key={opt} style={styles.checkboxRow}>
                                        <CheckBox selected={isChecked("situationChangeType", opt)} />
                                        <Text style={styles.bodyText}>{opt}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={styles.tableRowLast}>
                            <View style={styles.tableCellLabel}><Text>What Type Of Plan Change Are You Requesting?</Text></View>
                            <View style={styles.tableCellValue}>
                                {[
                                    "Plan Variation",
                                    "Plan Reassessment",
                                    "Not sure. If you’re not sure, we will contact you to discuss your situation."
                                ].map(opt => (
                                    <View key={opt} style={styles.checkboxRow}>
                                        <CheckBox selected={isChecked("planChangeRequest", opt)} />
                                        <Text style={styles.bodyText}>{opt}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                <NDISFooter pageNumber={5} />
            </Page>

            {/* Page 6: Part H cont. */}
            <Page size="A4" style={styles.page}>
                <NDISHeader />
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Describe What Has Changed With Your Situation?</Text></View>
                        <View style={[styles.tableCellValue, { minHeight: 100 }]}>
                            <Text style={formData.changeDescription ? styles.bodyText : { color: '#666' }}>
                                {getFieldValue('changeDescription') || 'Click or tap here to enter text.'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Why Does This Change Mean Your Current Funded Supports No Longer Meet Your Needs?</Text></View>
                        <View style={[styles.tableCellValue, { minHeight: 100 }]}>
                            <Text style={formData.changeReason ? styles.bodyText : { color: '#666' }}>
                                {getFieldValue('changeReason') || 'Click or tap here to enter text.'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>What Other Funded Supports Are You Asking To Be Included In Your Plan?</Text></View>
                        <View style={[styles.tableCellValue, { minHeight: 100 }]}>
                            <Text style={formData.otherSupports ? styles.bodyText : { color: '#666' }}>
                                {getFieldValue('otherSupports') || 'Click or tap here to enter text.'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Do You Have Any Additional Information?</Text></View>
                        <View style={styles.tableCellValue}>
                            <View style={styles.checkboxRow}>
                                <CheckBox selected={isChecked("additionalInfo", "Yes")} />
                                <Text style={styles.bodyText}>Yes. <Text style={{ color: '#666' }}>{getFieldValue('additionalInfoDetails') || 'Click or tap here to enter text.'}</Text></Text>
                            </View>
                            <Text style={{ fontSize: 8, marginTop: -4, marginBottom: 4 }}>Please attach your information when you return this form</Text>
                            <View style={styles.checkboxRow}>
                                <CheckBox selected={isChecked("additionalInfo", "No")} />
                                <Text style={styles.bodyText}>No.</Text>
                            </View>
                        </View>
                    </View>
                    <FormRow label="Start Date Of This Change" value={getFieldValue('partH_startDate')} />
                    <View style={styles.tableRowLast}>
                        <View style={styles.tableCellLabel}><Text>End Date</Text></View>
                        <View style={styles.tableCellValue}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {["Under 1 month", "Under 3 months", "Under 6 months", "Permanent."].map(opt => (
                                    <View key={opt} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 5 }}>
                                        <CheckBox selected={isChecked("partH_endDate", opt.replace('.', ''))} />
                                        <Text style={styles.bodyText}>{opt}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                <NDISFooter />
            </Page>

            {/* Page 7: Declaration & Privacy */}
            <Page size="A4" style={styles.page}>
                <NDISHeader />
                <Text style={[styles.sectionTitle, styles.purple]}>Part I: Your Declaration</Text>
                <Text style={styles.bodyText}>I confirm that the information provided in this form is complete and correct.</Text>
                <Text style={styles.bodyText}>I understand that:</Text>
                <View style={{ marginLeft: 20 }}>
                    <Text style={styles.bodyText}>• giving false or misleading information is a serious offence</Text>
                    <Text style={styles.bodyText}>• this information is protected by law and can only be given to someone else where Commonwealth law allows, or requires it, or where I give permission.</Text>
                </View>

                <Text style={styles.bodyText}>If this is a request for a change to my plan, I also understand that if the NDIA decides:</Text>
                <View style={{ marginLeft: 20, marginBottom: 10 }}>
                    <Text style={styles.bodyText}>• to vary or reassess my plan, they will consider the information I have provided, my new situation and new support needs, and decide what changes or supports to include in my new or varied plan.</Text>
                    <Text style={styles.bodyText}>• not to vary or reassess my plan, can ask for an internal review of that decision.</Text>
                </View>

                <View style={styles.table}>
                    <FormRow label="Full Name" value={getFieldValue('declarationName')} />
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Signature</Text></View>
                        <View style={[styles.tableCellValue, { height: 70 }]}>
                            {formData.signature?.startsWith('data:image') && <Image src={formData.signature} style={{ height: 60, objectFit: 'contain', alignSelf: 'flex-start' }} />}
                        </View>
                    </View>
                    <FormRow label="Date" value={getFieldValue('partI_declarationDate')} isLast={true} />
                </View>

                <Text style={[styles.bold, { fontSize: 11, marginBottom: 5 }]}>Privacy And Your Personal Information</Text>
                <Text style={[styles.sectionTitle, styles.purple, { fontSize: 11, marginTop: 5 }]}>Collection Of Your Personal Information</Text>
                <Text style={styles.bodyText}>
                    The National Disability Insurance Agency (NDIA) would like some personal information from you to simplify your engagement with the NDIS. Any personal information you provide to the NDIA is safe under the National Disability Insurance Scheme Act 2013 and the Privacy Act 1988. You can also ask to see what personal information (if any) we hold about you at any time and can seek correction if the information is wrong.
                </Text>

                <Text style={[styles.sectionTitle, styles.purple, { fontSize: 11 }]}>Personal Information Use And Disclosure</Text>
                <Text style={styles.bodyText}>
                    The NDIA will use your information to support your involvement in the NDIS. The NDIA will NOT use any of your personal information for any other purpose, or disclose your personal information to any other organisations or individuals (including any overseas recipients), unless authorised by law or you provide your consent for us to do so.
                </Text>

                <Text style={[styles.sectionTitle, styles.purple, { fontSize: 11 }]}>The NDIA’s Privacy Policy Describes</Text>
                <View style={{ marginLeft: 20 }}>
                    <Text style={styles.bodyText}>• how we use your personal information.</Text>
                    <Text style={styles.bodyText}>• why some personal information may be given to other organisations from time to time.</Text>
                    <Text style={styles.bodyText}>• how you can access the personal information we have about you on our system.</Text>
                </View>

                <NDISFooter />
            </Page>

            {/* Page 8: Privacy cont. */}
            <Page size="A4" style={styles.page}>
                <NDISHeader />
                <View style={{ marginLeft: 20 }}>
                    <Text style={styles.bodyText}>• how you can complain about a privacy breach, and how the NDIA deals with the complaint.</Text>
                    <Text style={styles.bodyText}>• how you can get your personal information corrected if it is wrong.</Text>
                </View>
                <Text style={styles.bodyText}>
                    You can read the policy at the <Text style={{ color: 'blue', textDecoration: 'underline' }}>www.ndis.gov.au/privacy</Text>.
                </Text>

                <Text style={[styles.sectionTitle, styles.purple, { fontSize: 11, marginTop: 10 }]}>Personal Information Storage</Text>
                <Text style={styles.bodyText}>
                    The NDIA uses an Australian Government computer system to store personal information. System users, other than NDIA staff, may at times be able to see your name when they perform program duties, however they can’t record, use or disclose information, and they will not know if you become an NDIS participant. State or territory government officials may also have personal information access as part of the agreement between governments to assist the states and territories in their NDIS evaluation.
                </Text>

                <NDISFooter />
            </Page>
        </Document>
    );
};

export default ChangeOfDetailsPDF;
