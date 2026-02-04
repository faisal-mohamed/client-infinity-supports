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
import { NDISHeader, NDISFooter, ndisCommonStyles as commonStyles } from './common/NDIS_Common';

// Register Deja Vu Sans font
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
        paddingBottom: 55,
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
        fontSize: 16, // Slightly smaller than "Consent" one as per typical NDIS forms or keep 21 if preferred
        fontWeight: 'bold',
        color: '#000000',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: commonStyles.formLabel.color, // Use NDIS Purple
        marginTop: 10,
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    bodyText: {
        fontSize: 10,
        lineHeight: 1.5,
        marginBottom: 6,
        color: '#000000',
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
        justifyContent: 'flex-start',
    },
    tableCellValue: {
        width: '65%',
        padding: 5,
        fontSize: 10,
        justifyContent: 'flex-start',
    },
    answerBox: {
        borderWidth: 0.8,
        borderColor: '#000000',
        padding: 8,
        minHeight: 60,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
    }
});

interface ReviewOfDecisionPDFProps {
    formData?: any;
    commonFieldsData?: any;
}

const ReviewOfDecisionPDF: React.FC<ReviewOfDecisionPDFProps> = ({
    formData = {},
    commonFieldsData = {},
}) => {

    const getFieldValue = (key: string) => {
        // Date Formatting
        if (key.toLowerCase().includes('date') || key.toLowerCase().includes('dob')) {
            let val = formData?.[key];
            if (!val) {
                // Formatting common data fields if needed
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

    return (
        <Document>
            {/* Page 1: Information and Instructions */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />
                <View style={styles.titleUnderline}>
                    <Text style={styles.mainTitle}>Request for a Review of a Decision</Text>
                </View>

                <Text style={styles.bodyText}>You can use this form when:</Text>
                <View style={{ marginLeft: 20, marginBottom: 10 }}>
                    <Text style={styles.bodyText}>• we have told you about a decision we have made</Text>
                    <Text style={styles.bodyText}>• you do not think our decision is right and want to ask for a review</Text>
                    <Text style={styles.bodyText}>• you are directly affected by the decision or have authority to ask for a review</Text>
                    <Text style={styles.bodyText}>• this request is within 3 months of the decision</Text>
                    <Text style={styles.bodyText}>• the decision is one that is reviewable under the law for the NDIS.</Text>
                </View>

                <Text style={styles.bodyText}>
                    Check the ‘Our Guidelines’ website (<Text style={{ color: 'blue', textDecoration: 'underline' }}>ourguidelines.ndis.gov.au</Text>) to get more information about the decisions we can review and who can ask for a review of these decisions. Select ‘<Text style={{ fontWeight: 'bold' }}>Reviewing our Decisions</Text>’ to read more.
                </Text>

                <Text style={styles.bodyText}>
                    If your situation or details change, it’s important to let us know. You can use the Change of Situation or Change of Details form from the ‘<Text style={{ fontWeight: 'bold' }}>Change in Circumstances</Text>’ website.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: 14, marginTop: 15 }]}>How to use this form:</Text>
                <Text style={styles.bodyText}>
                    If you are the <Text style={{ fontWeight: 'bold' }}>applicant</Text> or <Text style={{ fontWeight: 'bold' }}>participant</Text>, complete <Text style={{ fontWeight: 'bold' }}>Part A, Part C</Text> and <Text style={{ fontWeight: 'bold' }}>Part D</Text>.
                </Text>
                <Text style={styles.bodyText}>
                    You can ask someone to complete this form for you but you must let us know that they have your permission before they can do this, by:
                </Text>
                <View style={{ marginLeft: 20, marginBottom: 10 }}>
                    <Text style={styles.bodyText}>• calling us</Text>
                    <Text style={styles.bodyText}>• sending us a letter or email</Text>
                    <Text style={styles.bodyText}>• sending us a completed <Text style={{ color: 'blue', textDecoration: 'underline' }}>Consent for a Third Party to Act on Behalf of a Participant form</Text> from the ‘<Text style={{ fontWeight: 'bold' }}>Consent forms</Text>’ website.</Text>
                </View>

                <Text style={styles.bodyText}>
                    Then they can complete <Text style={{ fontWeight: 'bold' }}>Part A, Part B, Part C</Text> and <Text style={{ fontWeight: 'bold' }}>Part D</Text> for you. We can’t accept a form from someone on your behalf without your permission.
                </Text>
                <NDISFooter />
            </Page>

            {/* Page 2: Return Instructions and Next Steps */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />
                <Text style={[styles.sectionTitle, { fontSize: 14 }]}>How do I return this form to the NDIA?</Text>
                <Text style={styles.bodyText}>There are a few ways you can return this form to us:</Text>
                <View style={{ marginLeft: 20, marginBottom: 10 }}>
                    <Text style={styles.bodyText}><Text style={{ fontWeight: 'bold' }}>Email:</Text> enquiries@ndis.gov.au</Text>
                    <Text style={styles.bodyText}><Text style={{ fontWeight: 'bold' }}>Mail:</Text> NDIA, GPO Box 700, Canberra ACT 2601</Text>
                    <Text style={styles.bodyText}><Text style={{ fontWeight: 'bold' }}>In person:</Text> Visit a Local Area Coordinator, Early Childhood Partner or NDIS office in your area.</Text>
                </View>
                <Text style={styles.bodyText}>
                    You can also ask for a review by contacting us in any of the ways listed above. You do not need to complete this form to ask for a review of a decision.
                </Text>
                <Text style={styles.bodyText}>
                    If you would like us to think about any new evidence, such as medical or therapy reports, please send them with this form. You can find out more about <Text style={{ color: 'blue', textDecoration: 'underline' }}>Providing evidence of your disability</Text> or <Text style={{ color: 'blue', textDecoration: 'underline' }}>Providing evidence of disability for children</Text> from the ‘<Text style={{ fontWeight: 'bold' }}>Information to support your request</Text>’ website.
                </Text>

                <Text style={[styles.sectionTitle, { fontSize: 14, marginTop: 15 }]}>Next steps</Text>
                <Text style={styles.bodyText}>
                    Once we receive your review request, we will send you an acknowledgement letter. We aim to complete a review of a decision within 60 days from the day we receive your request. You can find out more about timeframes for our processes in the <Text style={{ color: 'blue', textDecoration: 'underline' }}>Participant Service Guarantee</Text>.
                </Text>
                <Text style={styles.bodyText}>
                    Your request will be allocated to an Internal Review Officer who is separate from the original decision. The Internal Review Officer will review the evidence provided for the original decision and think about any additional information provided for the internal review. If we need more information to review the decision, we will contact you to confirm what information we need and why we need it. Once a decision has been made, you will receive the outcome in writing.
                </Text>
                <NDISFooter />
            </Page>

            {/* Page 3: Part A & Part B (Form Start) */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />

                {/* Part A Details */}
                <View style={{ marginTop: 10 }}>
                    <Text style={[styles.sectionTitle, { color: '#6A1B9A' }]}>Part A: Person’s details</Text>
                    <Text style={[styles.bodyText, { marginBottom: 10 }]}>Please complete <Text style={{ fontWeight: 'bold' }}>Part A</Text> with the details of the applicant or participant.</Text>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, { borderTopWidth: 0.8, borderTopColor: '#000000' }]}><View style={styles.tableCellLabel}><Text>Full name</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('fullName')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Date of birth</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('dob')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>NDIS number</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('ndisNumber')}</Text></View></View>
                        <View style={styles.tableRowLast}><View style={styles.tableCellLabel}><Text>Preferred contact details (phone number, email address, etc.)</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('contactDetails')}</Text></View></View>
                    </View>
                </View>

                {/* Part B Details */}
                <View style={{ marginTop: 10 }}>
                    <Text style={[styles.sectionTitle, { color: '#6A1B9A' }]}>Part B: Third party details</Text>
                    <Text style={styles.bodyText}>Please complete <Text style={{ fontWeight: 'bold' }}>Part B</Text> if you are completing this form on behalf of the applicant or participant.</Text>

                    <Text style={styles.bodyText}>You can ask for a review of a decision for someone else if you can provide evidence that:</Text>
                    <View style={{ marginLeft: 20, marginBottom: 10 }}>
                        <Text style={styles.bodyText}>• you have <Text style={{ fontWeight: 'bold' }}>parental responsibility</Text> for them;</Text>
                        <Text style={styles.bodyText}>• you are their <Text style={{ fontWeight: 'bold' }}>legally authorised representative or legal guardian</Text>; or</Text>
                        <Text style={styles.bodyText}>• they let us know that you have permission to do this (see <Text style={{ color: 'blue', textDecoration: 'underline' }}>How to use this form</Text>).</Text>
                    </View>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, { borderTopWidth: 0.8, borderTopColor: '#000000' }]}><View style={styles.tableCellLabel}><Text>Full name</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('thirdPartyName')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Date of birth</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('thirdPartyDob')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Contact phone number</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('thirdPartyPhone')}</Text></View></View>
                        <View style={[styles.tableRowLast, { minHeight: 40 }]}><View style={styles.tableCellLabel}><Text>Relationship to <Text style={{ fontWeight: 'bold' }}>Person in Part A</Text>{'\n'}for example: child representative, advocate, nominee</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('thirdPartyRelationship')}</Text></View></View>
                    </View>
                </View>
                <NDISFooter />
            </Page>

            {/* Page 4: Part C - Information about your request */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />
                <View>
                    <Text style={[styles.sectionTitle, { color: '#6A1B9A' }]}>Part C: Information about your request</Text>
                    <Text style={[styles.bodyText, { marginBottom: 10 }]}>Please complete <Text style={{ fontWeight: 'bold' }}>Part C</Text> to give us more information about your request.</Text>

                    <View style={styles.table}>
                        {/* Decision to review */}
                        <View style={[styles.tableRow, { borderTopWidth: 0.8, borderTopColor: '#000000' }]} wrap={false}>
                            <View style={styles.tableCellLabel}><Text>What <Text style={{ fontWeight: 'bold' }}>decision</Text> do you want to review?</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('decisionToReview')}</Text></View>
                        </View>

                        {/* Date of decision */}
                        <View style={styles.tableRow} wrap={false}>
                            <View style={styles.tableCellLabel}>
                                <Text>What was the <Text style={{ fontWeight: 'bold' }}>date</Text> of this decision?</Text>
                                <Text style={{ fontSize: 8, marginTop: 4, color: '#333' }}>Remember, you need to ask for a review within <Text style={{ fontWeight: 'bold' }}>3 months</Text> of our decision.</Text>
                            </View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('decisionDate')}</Text></View>
                        </View>

                        {/* Decision Expected */}
                        <View style={styles.tableRow} wrap={false}>
                            <View style={styles.tableCellLabel}>
                                <Text>What decision were you <Text style={{ fontWeight: 'bold' }}>expecting</Text>?</Text>
                                <Text style={{ fontSize: 8, marginTop: 4, color: '#333' }}>
                                    If your request is to review a decision about an NDIS-funded support, please detail the type of support you are seeking, hours of support and frequency.
                                </Text>
                                <Text style={{ fontSize: 8, marginTop: 4, color: '#333', fontStyle: 'italic' }}>
                                    For example: ‘I need 4 hours additional social and community access support on a Saturday for 26 weeks so I can see my friends’. OR ‘I need 20 hours of occupational therapy supports to assess my equipment needs’. OR ‘I need 9 hours of 1:1 daytime support each week for 12 months’
                                </Text>
                            </View>
                            <View style={[styles.tableCellValue, { minHeight: 100 }]}><Text>{getFieldValue('decisionExpected')}</Text></View>
                        </View>

                        {/* Situation Changed */}
                        <View style={styles.tableRow} wrap={false}>
                            <View style={styles.tableCellLabel}>
                                <Text>Has your <Text style={{ fontWeight: 'bold' }}>situation changed</Text> since the decision was made?</Text>
                            </View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('situationChanged')}</Text></View>
                        </View>

                        {/* New Evidence */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}>
                                <Text>Do you have <Text style={{ fontWeight: 'bold' }}>new evidence</Text>, such as medical or therapy reports you would like us to think about? If so - please send with this form.</Text>
                            </View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('newEvidence')}</Text></View>
                        </View>

                        {/* Why Different Decision */}
                        <View style={styles.tableRowLast} wrap={false}>
                            <View style={styles.tableCellLabel}>
                                <Text><Text style={{ fontWeight: 'bold' }}>Why</Text> do you think we should make a different decision?</Text>
                            </View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('whyDifferentDecision')}</Text></View>
                        </View>
                    </View>
                </View>
                <NDISFooter />
            </Page>

            {/* Page 5: Part D - Declaration */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />
                <View>
                    <Text style={styles.sectionTitle}>Part D: Your declaration</Text>
                    <Text style={styles.bodyText}>I confirm that the information provided in this form is complete and correct.</Text>
                    <Text style={styles.bodyText}>I understand that:</Text>
                    <View style={{ marginLeft: 20, marginBottom: 15 }}>
                        <Text style={styles.bodyText}>• giving false or misleading information is a serious offence</Text>
                        <Text style={styles.bodyText}>• this information is protected by law and can only be given to someone else where Commonwealth law allows, or requires it, or where I give permission.</Text>
                    </View>

                    {/* Signature Box */}
                    <View wrap={false} style={{ marginBottom: 20 }}>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, { borderTopWidth: 0.8, borderTopColor: '#000000' }]}>
                                <View style={styles.tableCellLabel}><Text>Full name</Text></View>
                                <View style={styles.tableCellValue}><Text>{getFieldValue('declarationName')}</Text></View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.tableCellLabel}><Text>Signature</Text></View>
                                <View style={[styles.tableCellValue, { height: 70 }]}>
                                    {getFieldValue('signature')?.startsWith('data:image') && <Image src={getFieldValue('signature')} style={{ height: 60, objectFit: 'contain', alignSelf: 'flex-start' }} />}
                                </View>
                            </View>
                            <View style={styles.tableRowLast}>
                                <View style={styles.tableCellLabel}><Text>Date</Text></View>
                                <View style={styles.tableCellValue}><Text>{getFieldValue('declarationDate')}</Text></View>
                            </View>
                        </View>
                    </View>

                    {/* Privacy Section */}
                    <Text style={[styles.sectionTitle, { fontSize: 14, marginBottom: 8 }]}>Privacy and your personal information</Text>

                    <Text style={[styles.sectionTitle, { color: '#6A1B9A', fontSize: 11 }]}>Collection of your personal information</Text>
                    <Text style={styles.bodyText}>
                        The National Disability Insurance Agency (NDIA) would like some personal information from you to simplify your engagement with the NDIS. Any personal information you provide to the NDIA is safe under the National Disability Insurance Scheme Act 2013 and the Privacy Act 1988. You can also ask to see what personal information (if any) we hold about you at any time and can seek correction if the information is wrong.
                    </Text>

                    <Text style={[styles.sectionTitle, { color: '#6A1B9A', fontSize: 11 }]}>Personal information use and disclosure</Text>
                    <Text style={styles.bodyText}>The NDIA will use your information to support your involvement in the NDIS.</Text>
                    <Text style={styles.bodyText}>
                        The NDIA will NOT use any of your personal information for any other purpose or disclose your personal information to any other organisations or individuals (including any overseas recipients), unless authorised by law or you provide your consent for us to do so.
                    </Text>

                    <Text style={[styles.sectionTitle, { color: '#6A1B9A', fontSize: 11 }]}>The NDIA’s privacy policy describes</Text>
                    <View style={{ marginLeft: 20, marginBottom: 10 }}>
                        <Text style={styles.bodyText}>• how we use your personal information.</Text>
                        <Text style={styles.bodyText}>• why some personal information may be given to other organisations from time to time.</Text>
                        <Text style={styles.bodyText}>• how you can access the personal information we have about you on our system.</Text>
                        <Text style={styles.bodyText}>• how you can complain about a privacy breach, and how the NDIA deals with the complaint.</Text>
                        <Text style={styles.bodyText}>• how you can get your personal information corrected if it is wrong.</Text>
                    </View>

                    <Text style={styles.bodyText}>
                        You can read the policy at the <Text style={{ color: 'blue', textDecoration: 'underline' }}>www.ndis.gov.au/privacy</Text>.
                    </Text>

                    <Text style={[styles.sectionTitle, { color: '#6A1B9A', fontSize: 11 }]}>Personal information storage</Text>
                    <Text style={styles.bodyText}>
                        The NDIA uses an Australian Government computer system to store personal information. System users, other than NDIA staff, may at times be able to see your name when they perform program duties, however they can’t record, use or disclose information, and they will not know if you become an NDIS participant. State or territory government officials may also have personal information access as part of the agreement between governments to assist the states and territories in their NDIS evaluation.
                    </Text>
                </View>
                <NDISFooter />
            </Page>
        </Document>
    );
};

export default ReviewOfDecisionPDF;
