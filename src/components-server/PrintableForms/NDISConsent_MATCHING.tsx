import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font,
    Link
} from '@react-pdf/renderer';
import { NDISHeader, NDISFooter, NDISCheckbox, ndisCommonStyles as commonStyles } from './common/NDIS_Common';

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
        fontSize: 21,
        fontWeight: 'bold',
        color: '#000000',
    },
    bodyText: {
        fontSize: 10,
        lineHeight: 1.5,
        marginBottom: 6,
        color: '#000000',
    },
    listContainer: {
        marginLeft: 60, // Deep indentation from image 2
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 6,
        alignItems: 'flex-start',
    },
    bulletPoint: {
        width: 15,
        fontSize: 10,
        flexShrink: 0,
    },
    listItemText: {
        fontSize: 10,
        lineHeight: 1.4,
        flex: 1,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#5B2C6F', // NDIS Purple
        marginTop: 10,
        marginBottom: 5,
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 0.8,
        borderColor: '#000000',
        marginBottom: 15,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.8,
        borderBottomColor: '#000000',
        minHeight: 25,
    },
    tableRowLast: {
        flexDirection: 'row',
        minHeight: 25,
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
    },
});

interface NDISConsentPDFProps {
    formData?: any;
    commonFieldsData?: any;
}

const NDISConsent_MATCHING: React.FC<NDISConsentPDFProps> = ({
    formData = {},
    commonFieldsData = {},
}) => {

    const getFieldValue = (key: string) => {
        // Participant Name Fallback
        if (key === 'participantName') {
            if (formData?.['participantName']) return formData['participantName'];
            if (commonFieldsData?.name || commonFieldsData?.surname) {
                return `${commonFieldsData.name || ''} ${commonFieldsData.surname || ''}`.trim();
            }
            return '';
        }

        // Date Formatting & Fallbacks
        if (key.toLowerCase().includes('date') || key.toLowerCase().includes('dob')) {
            let val = formData?.[key];

            // Specific fallbacks for participant DOB
            if (key === 'participantDob') {
                val = formData?.participantDob || commonFieldsData?.dob || commonFieldsData?.dateOfBirth || formData?.dob;
            }

            if (!val) return '';

            // Format YYYY-MM-DD to DD/MM/YYYY
            if (val.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const [y, m, d] = val.split('-');
                return `${d}/${m}/${y}`;
            }
            // Format DD-MM-YYYY to DD/MM/YYYY
            if (val.match(/^\d{2}-\d{2}-\d{4}$/)) {
                return val.replace(/-/g, '/');
            }
            return val;
        }

        // Specific field fallbacks
        if (key === 'ndisNumber') return formData?.ndisNumber || commonFieldsData?.ndis || formData?.ndis || '';
        if (key === 'participantPhone') return formData?.participantPhone || commonFieldsData?.phone || '';
        if (key === 'participantEmail') return formData?.participantEmail || commonFieldsData?.email || '';

        // Organisation Defaults (Matching Edit.tsx)
        const defaults: Record<string, string> = {
            orgName: "Infinity Supports WA Pty Ltd",
            orgProviderNumber: "4050126792",
            orgAbn: "45 655 038 074",
            orgAddress: "PO Box 4275 BALDIVIS WA 6171",
        };

        const value = formData?.[key] || commonFieldsData?.[key] || defaults[key] || '';

        // Auto-capitalize first letter for consistency (e.g. for addresses, names, relationships)
        if (typeof value === 'string' && value.length > 0) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }

        return value;
    };

    const isOptionSelected = (field: string, option: string) => {
        const value = formData?.[field];
        if (!value) return false;

        const normalize = (s: string) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '').trim();
        const normOption = normalize(option);

        if (Array.isArray(value)) {
            return value.some((v: string) => {
                const normV = normalize(v);
                return normV === normOption || normV.includes(normOption) || normOption.includes(normV);
            });
        }

        const normValue = normalize(value);
        return !!(normValue === normOption || normValue.includes(normOption) || normOption.includes(normValue));
    };


    return (
        <Document>
            {/* Page 1: Introductory Instructions */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />
                <View style={styles.titleUnderline}>
                    <Text style={styles.mainTitle}>Consent for your NDIS information</Text>
                </View>

                <Text style={styles.bodyText}>Consent is a record of the permission you have given.</Text>
                <Text style={styles.bodyText}>
                    If you’re 18 or older, you have the right to make decisions about your business with the
                    NDIS. That’s why we need a record of your consent before we share your information with
                    anyone else or let someone else do things for you.
                </Text>
                <Text style={styles.bodyText}>Please use this form to give your consent for:</Text>

                <View style={styles.listContainer}>
                    <View style={styles.listItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.listItemText}>
                            The National Disability Insurance Agency (NDIA) to share your National Disability Insurance Scheme (NDIS) information with a person or organisation you choose
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.listItemText}>
                            A person or organisation (third party) to do things for you with the NDIS.
                        </Text>
                    </View>
                </View>

                <Text style={styles.bodyText}>For example, you might want to give consent for a family member who supports you to view your current plan and submit a home modification request for you.</Text>
                <Text style={styles.bodyText}>You can give consent if you’re the:</Text>

                <View style={styles.listContainer}>
                    <View style={styles.listItem}><Text style={styles.bulletPoint}>•</Text><Text style={styles.listItemText}>Applicant</Text></View>
                    <View style={styles.listItem}><Text style={styles.bulletPoint}>•</Text><Text style={styles.listItemText}>Participant</Text></View>
                    <View style={styles.listItem}><Text style={styles.bulletPoint}>•</Text><Text style={styles.listItemText}>Child representative or plan nominee for the participant</Text></View>
                    <View style={styles.listItem}><Text style={styles.bulletPoint}>•</Text><Text style={styles.listItemText}>Legally appointed decision maker for an applicant.</Text></View>
                </View>

                <Text style={styles.bodyText}>When we say applicant, we mean someone who is applying to the NDIS.</Text>
                <Text style={styles.bodyText}>
                    You don’t have to use this form to give your consent. You can let us know over the phone by
                    calling 1800 800 110 or by contacting us in any of the ways listed under {' '}
                    <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>How do I return this form to the NDIA</Text>.
                </Text>
                <Text style={styles.bodyText}>
                    We’ll only share your personal information if you’ve given your consent to the NDIA to do
                    this. Or, if we’re required or authorised to disclose your information by law.
                </Text>
                <Text style={styles.bodyText}>
                    You can <Text style={{ fontWeight: 'bold' }}>take away</Text> your consent at any time. You can let us know by mail, email, in person
                    or over the phone that you no longer consent to us sharing information on your behalf.
                </Text>
                <NDISFooter />
            </Page>

            {/* Page 2: Return Instructions & Part A/B Details */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />
                <View>
                    <Text style={[styles.mainTitle, { fontSize: 18, marginBottom: 5 }]}>How do I return this form to the NDIA?</Text>
                    <Text style={styles.bodyText}>There are a few ways you can return this form to us:</Text>
                    <View style={styles.listContainer}>
                        <View style={styles.listItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.listItemText}>Email for applicants: <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>NAT@ndis.gov.au</Text></Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.listItemText}>Email for participants: <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>enquiries@ndis.gov.au</Text></Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.listItemText}>Mail: NDIA, GPO Box 700, Canberra ACT 2601</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.listItemText}>
                                In person: Visit a <Text style={{ color: '#5B2C6F', fontWeight: 'bold' }}>local area coordinator</Text>, <Text style={{ color: '#5B2C6F', fontWeight: 'bold' }}>early childhood partner</Text> or <Text style={{ color: '#5B2C6F', fontWeight: 'bold' }}>NDIS office</Text> in your area.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Part A Details */}
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.sectionTitle}>Part A: Applicant/participant details</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Full name</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('participantName')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Date of birth (DD/MM/YYYY)</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('participantDob')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>NDIS number</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('ndisNumber')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Residential address</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('participantAddress')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Contact phone number</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('participantPhone')}</Text></View></View>
                        <View style={styles.tableRowLast}><View style={styles.tableCellLabel}><Text>Contact email</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('participantEmail')}</Text></View></View>
                    </View>

                    {/* Instruction Text */}
                    <View style={{ marginTop: 5, marginBottom: 15 }}>
                        <Text style={styles.bodyText}>Once you have completed Part A (above):</Text>
                        <View style={{ marginLeft: 20, marginTop: 5 }}>
                            <View style={styles.listItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.listItemText}>
                                    If you’re the <Text style={{ fontWeight: 'bold' }}>applicant</Text> or <Text style={{ fontWeight: 'bold' }}>participant</Text>, complete <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>Part C</Text>, <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>Part D</Text> and <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>Part E</Text> then sign the declaration in <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>Part F</Text>.
                                </Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.listItemText}>
                                    If you’re the <Text style={{ fontWeight: 'bold' }}>child representative</Text>, <Text style={{ fontWeight: 'bold' }}>plan nominee</Text> or <Text style={{ fontWeight: 'bold' }}>other legally appointed decision maker</Text>, complete <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>Part B</Text>. <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>Part C</Text>, <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>Part D</Text> and <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>Part E</Text>. You’ll then need to sign the declaration in <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>Part F</Text>.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <NDISFooter />
            </Page>

            {/* Page 3: Part B Details */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.sectionTitle}>Part B: Child representative, plan nominee, legally appointed decision maker details</Text>
                    <Text style={styles.bodyText}>Please provide your details if you’re completing this form on behalf of the applicant or participant:</Text>

                    <View style={{ marginLeft: 30, marginTop: 4, marginBottom: 10 }}>
                        <View style={[styles.listItem, { marginBottom: 2 }]}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={[styles.listItemText, { fontSize: 9.5 }]}>Under 18 years for whom you are a child representative, or</Text>
                        </View>
                        <View style={[styles.listItem, { marginBottom: 2 }]}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={[styles.listItemText, { fontSize: 9.5 }]}>For whom you are a plan nominee, or</Text>
                        </View>
                        <View style={[styles.listItem, { marginBottom: 2 }]}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={[styles.listItemText, { fontSize: 9.5 }]}>For whom you are a legally appointed decision maker (for example, a guardian).</Text>
                        </View>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Your full name</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('repName')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Your date of birth (DD/MM/YYYY)</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('repDob')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Your phone number</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('repPhone')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Your email</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('repEmail')}</Text></View></View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}>
                                <Text>What is your relationship to the participant/ the applicant</Text>
                                <Text style={{ fontSize: 8, marginTop: 4 }}>E.g. child representative, plan nominee, legally appointed decision maker</Text>
                            </View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('repRelationship')}</Text></View>
                        </View>
                        <View style={styles.tableRowLast}><View style={styles.tableCellLabel}><Text>Employee number or logon (if you are completing this form as part of your job)</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('employeeNumber')}</Text></View></View>
                    </View>
                </View>
                <NDISFooter />
            </Page>

            {/* Page 4: Part C Details (Person) */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />
                <View>
                    <Text style={styles.sectionTitle}>Part C: Give consent to a person or organisation</Text>
                    <Text style={styles.bodyText}>Please complete the details of the person or organisation you’re giving consent to.</Text>
                    <Text style={[styles.bodyText, { marginTop: 4 }]}>If there are more people or organisations you want to give consent to, you’ll need to provide consent for each one separately. For example, if you want to give consent to two people, you’ll need to complete this page for each person you’re giving consent to.</Text>
                    <Text style={[styles.bodyText, { marginTop: 4 }]}>You can also give your consent over the phone by calling <Text style={{ fontWeight: 'bold' }}>1800 800 110</Text>.</Text>
                    <Text style={[styles.bodyText, { marginTop: 4 }]}>Please mark the correct box and complete the details below.</Text>

                    <View style={[commonStyles.checkboxRow, { marginTop: 10 }]}>
                        <NDISCheckbox checked={isOptionSelected('consentToPerson', 'I am giving consent to a person')} />
                        <Text style={[styles.bodyText, { flex: 1 }]}>I am giving consent to a person</Text>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>First name</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('personFirstName')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Surname</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('personSurname')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Date of birth</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('personDob')}</Text></View></View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Is this person an NDIS provider or do they work for an NDIS provider? (if applicable)</Text></View>
                            <View style={styles.tableCellValue}>
                                <View style={commonStyles.checkboxRow}>
                                    <NDISCheckbox checked={isOptionSelected('personIsNdisProvider', 'Yes')} />
                                    <Text>Yes</Text>
                                </View>
                                <View style={commonStyles.checkboxRow}>
                                    <NDISCheckbox checked={isOptionSelected('personIsNdisProvider', 'No')} />
                                    <Text>No</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>If you answered yes to this question, what is the name of the NDIS provider?</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('personNdisProviderName')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>If they are an NDIS provider, what is their provider number?</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('personNdisProviderNumber')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Phone</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('personPhone')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Email</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('personEmail')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Address (Include street or PO Box number, Suburb, State and Postcode)</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('personAddress')}</Text></View></View>
                        <View style={styles.tableRowLast}><View style={styles.tableCellLabel}><Text>Relationship to Participant/Applicant</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('personRelationship')}</Text></View></View>
                    </View>
                </View>
                <NDISFooter />
            </Page>

            {/* Page 5: Part C Details (Organisation) */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />
                <View>
                    <Text style={styles.sectionTitle}>Part C: Give consent to a person or organisation (continued)</Text>
                    <Text style={styles.bodyText}>Consent is limited to 2 key contacts in the organisation. If your key contacts change, let us know so we can update who in the organisation you have given consent to. Contact us by calling <Text style={{ fontWeight: 'bold' }}>1800 800 110</Text> or in any of the ways listed under <Text style={{ fontWeight: 'bold' }}>How do I return this form to the NDIA.</Text></Text>
                    <Text style={[styles.bodyText, { marginTop: 8 }]}>To give consent to an organisation you need to give us the details for at least one key contact below.</Text>

                    <View style={[commonStyles.checkboxRow, { marginTop: 12 }]}>
                        <NDISCheckbox checked={isOptionSelected('consentToOrg', 'I am giving consent to an organisation')} />
                        <Text style={[styles.bodyText, { flex: 1 }]}>I am giving consent to an organisation</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Organisation name</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('orgName')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Key contact’s first name</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('orgContactFirstName')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Key contact’s surname</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('orgContactSurname')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Key contact’s position title (if applicable)</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('orgContactPosition')}</Text></View></View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Is this organisation an NDIS provider?</Text></View>
                            <View style={styles.tableCellValue}>
                                <View style={commonStyles.checkboxRow}>
                                    <NDISCheckbox checked={isOptionSelected('orgIsNdisProvider', 'Yes')} />
                                    <Text>Yes</Text>
                                </View>
                                <View style={commonStyles.checkboxRow}>
                                    <NDISCheckbox checked={isOptionSelected('orgIsNdisProvider', 'No')} />
                                    <Text>No</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>If they are an NDIS provider, do they provide NDIS supports to you?</Text></View>
                            <View style={styles.tableCellValue}>
                                <View style={commonStyles.checkboxRow}>
                                    <NDISCheckbox checked={isOptionSelected('orgProvideSupports', 'Yes')} />
                                    <Text>Yes</Text>
                                </View>
                                <View style={commonStyles.checkboxRow}>
                                    <NDISCheckbox checked={isOptionSelected('orgProvideSupports', 'No')} />
                                    <Text>No</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>If they are an NDIS provider, what is their provider number?</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('orgProviderNumber')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>ABN</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('orgAbn')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Phone</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('orgPhone')}</Text></View></View>
                        <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Email</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('orgEmail')}</Text></View></View>
                        <View style={styles.tableRowLast}><View style={styles.tableCellLabel}><Text>Address (include street or PO Box number, suburb, state and postcode)</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('orgAddress')}</Text></View></View>
                    </View>
                </View>
                <NDISFooter />
            </Page>


            {/* Page 6: Part D Consent Choices */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />
                <View>
                    <Text style={styles.sectionTitle}>Part D: Choose the consent types</Text>
                    <Text style={styles.bodyText}>You can choose the types of consent you want the person or organisation in <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>Part C</Text> to have. To do this please mark the relevant boxes in the checklists below.</Text>
                    <Text style={[styles.bodyText, { marginTop: 8, fontWeight: 'bold' }]}>I am providing consent for the person or organisation named in Part C to have the following types of consent.</Text>
                    <Text style={[styles.bodyText, { marginTop: 8, fontWeight: 'bold' }]}>Consent to share information about my:</Text>
                    <View style={{ marginTop: 5 }}>
                        {[
                            "NDIS contact", "Assessments and reports", "Current NDIS plan, including my goals and aspirations",
                            "NDIS application outcome", "NDIS application form", "Current NDIS funding", "Previous NDIS funding",
                            "Previous NDIS plans, including my goals and aspirations", "Bank account details",
                            "Name, date of birth, NDIS participant number and NDIS participant status",
                            "Address, email and phone number", "Communication preferences",
                            "Correspondence preferences – for example, if I prefer to receive NDIS information in an email, letter or over the phone",
                            "Disability or disabilities that are recorded in the NDIS system",
                            "Informal supports", "Service providers", "All of the above"
                        ].map(opt => (
                            <View style={commonStyles.checkboxRow} key={opt}>
                                <NDISCheckbox checked={isOptionSelected('consentTypes', opt)} />
                                <Text style={{ fontSize: 9, flex: 1 }}>{opt}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={[styles.bodyText, { marginTop: 15 }]}>Consent to do these things on my behalf:</Text>
                    <View style={{ marginTop: 5 }}>
                        {[
                            "Submit an NDIS application", "Submit a request for assistive technology, home modifications, or other specific supports",
                            "Submit additional information requested by the NDIA", "Make a complaint or give feedback to the NDIA",
                            "Tell the NDIA about change in my disability", "Submit claims for my current plan",
                            "Ask to review a decision made by the NDIA", "Ask for a plan change", "All of the above"
                        ].map(opt => (
                            <View style={commonStyles.checkboxRow} key={opt}>
                                <NDISCheckbox checked={isOptionSelected('consentBehalf', opt)} />
                                <Text style={{ fontSize: 9, flex: 1 }}>{opt}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>Consent to change my:</Text>
                        {["Personal details", "Communication preferences", "Correspondence preferences", "All of the above"].map(opt => (
                            <View style={commonStyles.checkboxRow} key={opt}>
                                <NDISCheckbox checked={isOptionSelected('consentChange', opt)} />
                                <Text style={{ fontSize: 9, flex: 1 }}>{opt}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <NDISFooter />
            </Page>

            {/* Page 7: Part D Continued & Part E */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />
                <View>
                    <View>
                        <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Part D: Choose the consent types (continued)</Text>
                        <Text style={[styles.bodyText, { fontWeight: 'bold' }]}>Are there other things you want the person to do on your behalf, or information you want to share:</Text>
                        <View style={[commonStyles.checkboxRow, { marginTop: 5 }]}>
                            <NDISCheckbox checked={isOptionSelected('consentOtherCheck', 'If so, please tell us what this is below:')} />
                            <Text style={{ fontSize: 9 }}>If so, please tell us what this is below:</Text>
                        </View>
                        {isOptionSelected('consentOtherCheck', 'If so, please tell us what this is below:') && (
                            <View style={{ marginTop: 5 }}>
                                <View style={[styles.table, { minHeight: 60, padding: 10 }]}>
                                    <Text style={{ lineHeight: 1.4 }}>{getFieldValue('consentOtherDetails')}</Text>
                                </View>
                                <Text style={[styles.bodyText, { fontSize: 8, marginTop: 5 }]}>
                                    We’ll do our best to include these other things. If we’re unable to do this, we’ll let you know and explain why.
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Part E */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.sectionTitle}>Part E: Choose the consent length</Text>
                        <Text style={styles.bodyText}>
                            You can choose how long you want the person or organisation in <Text style={{ color: '#0055BB', textDecoration: 'underline' }}>Part C</Text> to have consent. To do this please mark the relevant box. If you want the consent to end on a set date, please record this below.
                        </Text>
                        <Text style={[styles.bodyText, { marginTop: 8, fontWeight: 'bold' }]}>How long are you giving consent for?</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                            <View style={[commonStyles.checkboxRow, { marginBottom: 0, marginRight: 40 }]}>
                                <NDISCheckbox checked={isOptionSelected('consentLength', 'One time only')} />
                                <Text style={styles.bodyText}>One time only</Text>
                            </View>
                            <View style={[commonStyles.checkboxRow, { marginBottom: 0 }]}>
                                <NDISCheckbox checked={isOptionSelected('consentLength', 'Until a set date (DD/MM/YYYY):')} />
                                <Text style={styles.bodyText}>Until a set date (DD/MM/YYYY): </Text>
                                <Text style={styles.bodyText}>
                                    {getFieldValue('consentEndDate') || '____ / ____ / ________'}
                                </Text>
                            </View>
                        </View>

                        <View style={commonStyles.checkboxRow}>
                            <NDISCheckbox checked={isOptionSelected('consentLength', 'Ongoing (enduring)')} />
                            <Text style={styles.bodyText}>Ongoing (enduring)</Text>
                        </View>
                    </View>
                </View>
                <NDISFooter />
            </Page>

            {/* Page 8: Part F & Signature */}
            <Page size="A4" style={styles.page}>
                <NDISHeader title="Form" />
                <View>
                    <View style={{ marginTop: 5 }}>
                        <Text style={styles.sectionTitle}>Part F: Your declaration</Text>
                        <Text style={[styles.bodyText, { marginBottom: 8 }]}>This part needs to be signed by whoever completes this form. This may be the participant, applicant or child representative, plan nominee or legally appointed decision maker.</Text>
                        <Text style={styles.bodyText}>I confirm that:</Text>
                        <View style={styles.listContainer}>
                            {[
                                "I understand I can get further information about how the NDIA handles my personal information from the Privacy Notice or Privacy Policy on the NDIS website. I can find this information on the NDIS website.",
                                "I understand I have given the NDIA consent to give information about me to the third party or parties I have listed at Part C on this form.",
                                "I understand that the third party or parties I have given consent to will be able to access my information and/or act on my behalf.",
                                "I understand I can take away or change my consent to share information and/or my consent for a third party to act on my behalf at any time.",
                                "I confirm the information provided in this form is complete and correct.",
                                "I understand giving false or misleading information is a serious offence.",
                                "I understand this information is protected by law and the NDIA can only share it with someone else where Commonwealth law allows, or requires it, or where I give consent.",
                                "I have given my consent freely and no one has pressured me into doing so."
                            ].map((item, idx) => (
                                <View style={styles.listItem} key={idx}><Text style={styles.bulletPoint}>•</Text><Text style={styles.listItemText}>{item}</Text></View>
                            ))}
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={[styles.bodyText, { fontSize: 8, marginBottom: 4 }]}>
                            You can find out more about how we collect, use and disclose your personal and sensitive information on our website (ndis.gov.au). Select ‘About’, then select ‘Policies’, then ‘Freedom of Information’, then ‘Privacy’ from the menu on the right.
                        </Text>
                        <Text style={[styles.bodyText, { fontSize: 8, marginBottom: 8 }]}>
                            If we don’t agree to your request, we’ll let you know and explain why.
                        </Text>
                    </View>

                    {/* Signature Box */}
                    <View wrap={false} style={{ marginTop: 5 }}>
                        <Text style={styles.bodyText}>Please sign here to give your consent as indicated in this form.</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={styles.tableCellLabel}><Text>Signature</Text></View>
                                <View style={[styles.tableCellValue, { height: 60 }]}>
                                    {getFieldValue('signature')?.startsWith('data:image') && <Image src={getFieldValue('signature')} style={{ height: 50, objectFit: 'contain' }} />}
                                </View>
                            </View>
                            <View style={styles.tableRow}><View style={styles.tableCellLabel}><Text>Name</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('signatoryName')}</Text></View></View>
                            <View style={styles.tableRowLast}><View style={styles.tableCellLabel}><Text>Date (DD/MM/YYYY)</Text></View><View style={styles.tableCellValue}><Text>{getFieldValue('signatureDate')}</Text></View></View>
                        </View>
                    </View>
                </View>
                <NDISFooter />
            </Page>

        </Document >
    );
};

export default NDISConsent_MATCHING;
