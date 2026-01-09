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

// NDIS Purple Color
const NDIS_PURPLE = '#5B2C6F';
const TABLE_LABEL_BG = '#E5E7EB'; // Light grey for table labels

const styles = StyleSheet.create({
    page: {
        paddingBottom: 40,
        fontFamily: 'DejaVuSans',
        fontSize: 10,
        color: '#000000',
    },
    // Custom Header with Curve
    // Custom Header with Curve
    headerWrapper: {
        marginBottom: 30,
        backgroundColor: 'transparent',
        marginRight: 20, // Visual gap on the right side
    },
    headerTopStrip: {
        backgroundColor: '#7A4B89', // Lighter purple top strip
        height: 15,
        width: '100%',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    headerMainContent: {
        backgroundColor: NDIS_PURPLE,
        height: 105,
        borderBottomRightRadius: 60, // Create the curve effect
        paddingLeft: 30,
        justifyContent: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    logoText: {
        color: 'white',
        fontSize: 38, // Reduced from 45
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
        lineHeight: 1,
    },
    logoIDotContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        marginBottom: 6, // Adjusted for smaller font baseline
        marginLeft: 1,
        marginRight: 1,
    },
    logoIDot: {
        width: 8.5,
        height: 8.5,
        borderRadius: 4.25,
        backgroundColor: '#A5C831', // NDIS Green
        marginBottom: 4,
    },
    logoIStem: {
        width: 8.5,
        height: 20, // Adjusted x-height for 38px font
        backgroundColor: 'white',
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
    },
    contentContainer: {
        paddingHorizontal: 40,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: NDIS_PURPLE,
        marginBottom: 15,
    },
    bodyText: {
        fontSize: 10,
        lineHeight: 1.4,
        marginBottom: 10,
        color: '#333333',
    },
    linkText: {
        color: 'blue',
        textDecoration: 'underline',
    },

    // Section Headers
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: NDIS_PURPLE,
        marginTop: 20,
        marginBottom: 10,
    },

    // Section A Lists
    listContainer: {
        marginLeft: 20,
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    bulletPoint: {
        width: 10,
        fontSize: 10,
    },
    listItemText: {
        fontSize: 10,
        flex: 1,
    },

    // Tables (Section B style)
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000000',
        marginBottom: 15,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        minHeight: 25, // Ensure rows have some height
    },
    tableRowLast: {
        flexDirection: 'row',
        minHeight: 25,
    },
    tableCellLabel: {
        width: '35%',
        padding: 5,
        backgroundColor: TABLE_LABEL_BG,
        borderRightWidth: 1,
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

    spacer: {
        height: 10,
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
    },
    footerText: {
        color: NDIS_PURPLE,
        fontSize: 10,
        fontWeight: 'bold',
    },

    // Dynamic Form Sections (C & D placeholders)
    fieldLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
        marginTop: 8,
    },
    fieldValue: {
        fontSize: 10,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        paddingBottom: 2,
        minHeight: 14,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    checkboxBox: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: '#000000',
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: NDIS_PURPLE,
    },
    checkMark: {
        color: 'white',
        fontSize: 8,
    },
});

interface ConflictOfInterestPDFProps {
    formData?: any;
    commonFieldsData?: any;
}

const ConflictOfInterest_MATCHING: React.FC<ConflictOfInterestPDFProps> = ({
    formData = {},
    commonFieldsData = {},
}) => {

    const getFieldValue = (key: string) => {
        return formData?.[key] || commonFieldsData?.[key] || '';
    };

    // Helper to get formatted date
    const today = new Date().toLocaleDateString('en-AU');

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Header - Purple Block with Curve */}
                {/* Header - Purple Block with Curve and Top Strip */}
                <View style={styles.headerWrapper}>
                    {/* Top Lighter Strip */}
                    <View style={styles.headerTopStrip} />

                    {/* Main Purple Content */}
                    <View style={styles.headerMainContent}>
                        {/* NDIS Logo Construction */}
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>nd</Text>
                            <View style={styles.logoIDotContainer}>
                                <View style={styles.logoIDot} />
                                <View style={styles.logoIStem} />
                            </View>
                            <Text style={styles.logoText}>s</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.contentContainer} wrap={true}>
                    <Text style={styles.mainTitle}>Conflict of interest declaration</Text>

                    <Text style={[styles.bodyText, { color: NDIS_PURPLE }]}>
                        This form helps National Disability Insurance Scheme (NDIS) providers be transparent and declare a conflict of interest.
                    </Text>

                    <Text style={[styles.bodyText, { color: NDIS_PURPLE }]}>
                        When completing this form, providers should give participants or their authorised representatives the opportunity to review the information provided, as well as the <Link src="https://www.ndis.gov.au/providers/provider-compliance/conflicts-interest-ndis-provider-market" style={{ color: 'blue', textDecoration: 'underline' }}>Conflict of Interest resources</Link>, and raise any concerns they may have.
                    </Text>

                    <Text style={[styles.bodyText, { color: NDIS_PURPLE }]}>
                        NDIS providers should keep this form for their personal records and provide a signed copy to the participant or their authorised representative.
                    </Text>

                    <Text style={[styles.bodyText, { color: NDIS_PURPLE }]}>
                        This declaration form is an agreement between a provider and a participant, and does not need to be submitted to the NDIA.
                    </Text>

                    <View style={styles.spacer} />

                    <Text style={[styles.sectionTitle, { color: NDIS_PURPLE }]}>Section A: Definition</Text>

                    <Text style={styles.bodyText}>
                        A conflict of interest occurs when a person or organisation has an opportunity to put what will benefit them (their own interests) ahead of the interests of the person they are supporting.
                    </Text>

                    <Text style={styles.bodyText}>These conflicts may be:</Text>

                    <View style={styles.listContainer}>
                        <View style={styles.listItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.listItemText}>actual – it happened or is happening</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.listItemText}>potential – it might happen</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.listItemText}>perceived – it seems like it has happened or might happen.</Text>
                        </View>
                    </View>

                    <Text style={styles.bodyText}>
                        'Own interests' can include the interests of a person's family, friends, employer or other organisations they are involved with.
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>ndis.gov.au</Text>
                </View>
            </Page>

            {/* Page 2 - Details */}
            <Page size="A4" style={styles.page}>
                {/* No header on subsequent pages based on screenshot? Or maybe there is? Assuming plain for now based on image 2 */}
                <View style={[styles.contentContainer, { paddingTop: 40 }]}>

                    <Text style={styles.bodyText}>
                        A conflict of interest could be of a financial, business or personal nature, including any financial and/or corporate interest or conflicted relationship the NDIS provider may have with other entities, including businesses and organisations. A conflict of interest could also be of a personal nature, including but not limited to a cultural, religious, or social relationship.
                    </Text>

                    {/* Section B */}
                    <Text style={styles.sectionTitle}>Section B: Participant, provider and employee details</Text>

                    <Text style={[styles.sectionTitle, { fontSize: 12, marginTop: 10 }]}>Participant details</Text>

                    {/* Participant Table */}
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Full name</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('participantName')}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Date of birth (DD/MM/YYYY)</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('participantDob')}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>NDIS number</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('ndisNumber')}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Residential address</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('participantAddress')}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Contact phone number</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('participantPhone')}</Text></View>
                        </View>
                        <View style={styles.tableRowLast}>
                            <View style={styles.tableCellLabel}><Text>Contact email</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('participantEmail')}</Text></View>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { fontSize: 12, marginTop: 10 }]}>Provider details</Text>

                    {/* Provider Table */}
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Organisation name</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('orgName') || 'Infinity Supports WA'}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Provider No</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('providerNumber') || '4050126792'}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Address</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('providerAddress') || 'Po Box 4275 Baldivis 6171'}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Contact phone number</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('providerPhone') || '0493282661'}</Text></View>
                        </View>
                        <View style={styles.tableRowLast}>
                            <View style={styles.tableCellLabel}><Text>Contact email</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('providerEmail') || 'sharon@inifnitysupportswa.org'}</Text></View>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { fontSize: 12, marginTop: 10 }]}>Employee details</Text>

                    {/* Employee Table */}
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Full name</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('employeeName')}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Relationship to participant</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('employeeRelationship')}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Job title or position</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('employeePosition')}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCellLabel}><Text>Contact phone number</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('employeePhone')}</Text></View>
                        </View>
                        <View style={styles.tableRowLast}>
                            <View style={styles.tableCellLabel}><Text>Contact email</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('employeeEmail')}</Text></View>
                        </View>
                    </View>

                    {/* Section C (Matching Style) */}
                    <Text style={styles.sectionTitle}>Section C: Identification of the conflict of interest</Text>

                    <View style={{ flexDirection: 'row', borderWidth: 1, borderStyle: 'solid', borderColor: 'black', marginBottom: 15 }}>
                        <View style={{ padding: 5, backgroundColor: '#e6e6e6', width: '40%', borderRightWidth: 1, borderRightColor: 'black' }}>
                            <Text style={{ fontSize: 10 }}>Date conflict of interest identified</Text>
                        </View>
                        <View style={{ padding: 5, width: '60%' }}>
                            <Text style={{ fontSize: 10 }}>{getFieldValue('conflictIdentifiedDate') || today}</Text>
                        </View>
                    </View>

                    <Text style={[styles.fieldLabel, { color: NDIS_PURPLE, fontSize: 11, marginBottom: 5 }]}>1. The conflict of interest has been identified as:</Text>
                    <Text style={{ fontSize: 10, marginBottom: 5 }}>Please tick all that apply.</Text>
                    {[
                        "an actual conflict of interest – it has happened or is happening",
                        "a potential conflict of interest – it might happen",
                        "a perceived conflict of interest – it seems like it has happened or might happen."
                    ].map((opt) => {
                        const isSelected = (formData?.conflictType || []).some((v: string) => v.toLowerCase().includes(opt.split('–')[0].trim().toLowerCase()));
                        return (
                            <View style={styles.checkboxRow} key={opt}>
                                <View style={[styles.checkboxBox, isSelected && styles.checkboxChecked]}>
                                    {isSelected && <Text style={styles.checkMark}>X</Text>}
                                </View>
                                <Text style={{ fontSize: 10 }}>{opt}</Text>
                            </View>
                        )
                    })}

                    <Text style={[styles.fieldLabel, { color: NDIS_PURPLE, fontSize: 11, marginTop: 15, marginBottom: 5 }]}>2. Indicate who the conflicted relationship relates to:</Text>
                    <Text style={{ fontSize: 10, marginBottom: 5 }}>Please tick all that apply.</Text>
                    {[
                        "an employee",
                        "a provider or organisation",
                        "a business owner."
                    ].map((opt) => {
                        const isSelected = (formData?.conflictRelatesTo || []).some((v: string) => v.toLowerCase().includes(opt.split('–')[0].trim().toLowerCase()));
                        return (
                            <View style={styles.checkboxRow} key={opt}>
                                <View style={[styles.checkboxBox, isSelected && styles.checkboxChecked]}>
                                    {isSelected && <Text style={styles.checkMark}>X</Text>}
                                </View>
                                <Text style={{ fontSize: 10 }}>{opt}</Text>
                            </View>
                        )
                    })}

                    <View break />

                    <Text style={[styles.fieldLabel, { color: NDIS_PURPLE, fontSize: 11, marginTop: 15, marginBottom: 5 }]}>3. What is the nature of the conflict of interest?</Text>
                    <Text style={{ fontSize: 10, marginBottom: 5 }}>Please tick all that apply.</Text>
                    {[
                        "Financial. For example, receiving a secondary gain, financial incentive or gift.",
                        "Business. For example, there are multiple supports and services provided from the same or connected business or organisation.",
                        "Personal. For example, a friend or family member benefits from the arrangement."
                    ].map((opt) => {
                        const isSelected = (formData?.conflictNature || []).some((v: string) => v.toLowerCase().includes(opt.split('.')[0].trim().toLowerCase()));
                        return (
                            <View style={styles.checkboxRow} key={opt}>
                                <View style={[styles.checkboxBox, isSelected && styles.checkboxChecked]}>
                                    {isSelected && <Text style={styles.checkMark}>X</Text>}
                                </View>
                                <Text style={{ fontSize: 10, width: '90%' }}>{opt}</Text>
                            </View>
                        )
                    })}

                    <Text style={[styles.fieldLabel, { color: NDIS_PURPLE, fontSize: 11, marginTop: 15, marginBottom: 5 }]}>4. Describe the conflict of interest including who is involved and the circumstances.</Text>
                    <View style={[styles.table, { marginBottom: 10, minHeight: 80 }]}>
                        <View style={styles.tableRowLast}>
                            <View style={[styles.tableCellValue, { width: '100%', borderRightWidth: 0 }]}><Text>{getFieldValue('conflictDescription')}</Text></View>
                        </View>
                    </View>

                    <Text style={[styles.fieldLabel, { color: NDIS_PURPLE, fontSize: 11, marginTop: 15, marginBottom: 5 }]}>5. Discuss and describe the participant’s concerns using their own words.</Text>
                    <View style={[styles.table, { marginBottom: 10, minHeight: 80 }]}>
                        <View style={styles.tableRowLast}>
                            <View style={[styles.tableCellValue, { width: '100%', borderRightWidth: 0 }]}><Text>{getFieldValue('participantConcerns')}</Text></View>
                        </View>
                    </View>

                    <View break />

                    <Text style={[styles.fieldLabel, { color: NDIS_PURPLE, fontSize: 11, marginTop: 15, marginBottom: 5 }]}>6. Can the conflict be avoided?</Text>
                    <Text style={{ fontSize: 10, marginBottom: 5 }}>Choose the best answer.</Text>
                    {[
                        "Yes, (outline strategies to avoid in Section D: Provider Management Plan).",
                        "Yes, the participant has made an informed choice to receive supports from a specified provider after fully thinking about options available.",
                        "No, limited-service options are available in regional, rural and remote areas.",
                        "No, services require specific cultural and religious choices and practices.",
                        "No, highly specialised services have few accredited providers that operate nationally."
                    ].map((opt) => {
                        const isSelected = (formData?.conflictAvoidable || []).some((v: string) => v.toLowerCase().trim() === opt.toLowerCase().trim() || (v.toLowerCase().startsWith('yes') && opt.toLowerCase().startsWith('yes')) || (v.toLowerCase().startsWith('no') && opt.toLowerCase().startsWith('no')));
                        // Simple matching logic, might need refinement based on exact data values
                        return (
                            <View style={styles.checkboxRow} key={opt}>
                                <View style={[styles.checkboxBox, isSelected && styles.checkboxChecked]}>
                                    {isSelected && <Text style={styles.checkMark}>X</Text>}
                                </View>
                                <Text style={{ fontSize: 10, width: '90%' }}>{opt}</Text>
                            </View>
                        )
                    })}
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>ndis.gov.au</Text>
                </View>
            </Page>

            {/* Page 3 - Section D */}
            <Page size="A4" style={styles.page}>
                <View style={[styles.contentContainer, { paddingTop: 40 }]}>
                    <Text style={styles.sectionTitle}>Section D: Provider management plan</Text>

                    {/* Question 7 */}
                    <Text style={[styles.fieldLabel, { color: NDIS_PURPLE, fontSize: 11, marginBottom: 5 }]}>7. Describe the risk or impacts associated with the conflict.</Text>
                    <View style={[styles.table, { marginBottom: 15, padding: 5, minHeight: 80 }]}>
                        {/* Static content mimicking the image or dynamic if fields exist, but user wants 'like this' so I'll structure it primarily as a box */}
                        <View style={styles.listContainer}>
                            {(getFieldValue('conflictRisks') ? [getFieldValue('conflictRisks')] : [
                                "Perceived reduced participant choice and control",
                                "Perceived pressure to use other services from the same organization",
                                "Perceived lack of impartial referrals or recommendations"
                            ]).map((item: string, idx: number) => (
                                <View style={styles.listItem} key={idx}>
                                    <Text style={styles.bulletPoint}>•</Text>
                                    <Text style={styles.listItemText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Question 8 */}
                    <Text style={[styles.fieldLabel, { color: NDIS_PURPLE, fontSize: 11, marginBottom: 5 }]}>8. List the alternative options that were explored and offered to the participant.</Text>
                    <View style={[styles.table, { marginBottom: 15, padding: 5, minHeight: 80 }]}>
                        <View style={styles.listContainer}>
                            {(getFieldValue('alternativeOptions') ? [getFieldValue('alternativeOptions')] : [
                                "The participant was previously with another organisation for service delivery whilst Infinity Supports provided Support Coordination. The family requested a change in provider due to lack of continuity and poor quality of care.",
                                "Support Coordinator offered alternative providers in the local area as mentioned in the service agreement. The family requested services were provided by Infinity Supports due to reputation of quality services.",
                                "The family were offered to be transferred to another Support Coordinator, but this was declined also."
                            ]).map((item: string, idx: number) => (
                                <View style={styles.listItem} key={idx}>
                                    <Text style={styles.bulletPoint}>•</Text>
                                    <Text style={styles.listItemText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Question 9 */}
                    <Text style={[styles.fieldLabel, { color: NDIS_PURPLE, fontSize: 11, marginBottom: 5 }]}>9. Describe the management strategy and actions to be taken by the NDIS provider.</Text>
                    {[
                        "Monitor. Implement close supervision.",
                        "Monitor. No further action required.",
                        "Implement. An independent third-party contact or review.",
                        "Restrict. Limit conflicted person’s involvement in delivering supports and services.",
                        "Remove. Conflicted person to be removed from delivering supports and services to participant named in section A."
                    ].map((opt) => {
                        const isSelected = (formData?.managementAction || []).some((v: string) => v.toLowerCase().includes(opt.split('.')[0].trim().toLowerCase()));
                        return (
                            <View style={[styles.checkboxRow, { marginBottom: 6 }]} key={opt}>
                                <View style={[styles.checkboxBox, isSelected && styles.checkboxChecked]}>
                                    {isSelected && <Text style={styles.checkMark}>X</Text>}
                                </View>
                                <Text style={{ fontSize: 10 }}>{opt}</Text>
                            </View>
                        )
                    })}

                    {/* Management Plan Box */}
                    <View style={[styles.table, { marginTop: 10, padding: 5, minHeight: 150 }]}>
                        <Text style={{ fontSize: 10, marginBottom: 5, fontFamily: 'Helvetica' }}>
                            Infinity Supports WA has a clear, structured plan to ensure transparency, independence, and safety when Support Coordination and Service Delivery are provided to the same participant.
                        </Text>
                        <View style={styles.listContainer}>
                            {[
                                "Different staff deliver Support Coordination and Direct Supports, maintaining strict role boundaries and avoiding overlap.",
                                "Support Coordinators do not recommend Infinity Supports WA services unless the participant specifically requests them.",
                                "Staff maintain separate participant files, supervision structures, and reporting lines to protect impartiality.",
                                "Participants have direct access to directors (Sharon or Anand) for independent oversight and to raise concerns, along with full contact details for the NDIS Quality and Safeguards Commission.",
                                "Participants are provided with written information about alternative providers and may change providers at any time. Full support is provided to transition to another provider upon request or during plan renewal.",
                                "An independent check-in or review may be arranged to ensure the participant’s choices remain free and informed.",
                                "The conflict is recorded in the Conflict-of-Interest Register, reviewed annually or sooner if circumstances change.",
                                "All personal information is handled strictly in accordance with Infinity Supports WA’s Privacy and Confidentiality Policy."
                            ].map((item, idx) => (
                                <View style={[styles.listItem, { marginBottom: 6 }]} key={idx}>
                                    <Text style={styles.bulletPoint}>•</Text>
                                    <Text style={styles.listItemText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Question 10 */}
                    <Text style={[styles.fieldLabel, { color: NDIS_PURPLE, fontSize: 11, marginTop: 15, marginBottom: 5 }]}>10. The conflict has been discussed with:</Text>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 10, marginBottom: 5 }}>Please tick all that apply.</Text>
                        {[
                            "NDIS participant",
                            "authorised representative or decision supporter", // Keeping text for now as blank seems wrong, can leave value blank if visually requested
                            "employee",
                            "other, please state ."
                        ].map((opt, idx) => {
                            // Logic to detect if it's the 2nd options which seemed blank in one screenshot
                            const isLegacyAuthRep = idx === 1;
                            const isSelected = (formData?.discussedWith || []).some((v: string) => v.toLowerCase().includes("participant") && idx === 0 ? true : v.toLowerCase().includes(opt.toLowerCase()));

                            return (
                                <View style={[styles.checkboxRow, { marginBottom: 6 }]} key={idx}>
                                    <View style={[styles.checkboxBox, isSelected && styles.checkboxChecked]}>
                                        {isSelected && <Text style={styles.checkMark}>X</Text>}
                                    </View>
                                    <Text style={{ fontSize: 10 }}>{opt}</Text>
                                </View>
                            )
                        })}
                    </View>

                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>ndis.gov.au</Text>
                </View>
            </Page>

            {/* Page 4 - Section E */}
            <Page size="A4" style={styles.page}>
                <View style={[styles.contentContainer, { paddingTop: 40 }]}>
                    <Text style={styles.sectionTitle}>Section E: Acknowledgement and declaration</Text>
                    <Text style={styles.bodyText}>
                        This form needs to be signed by relevant parties to acknowledge the information contained within this form is true and correct. This may be the:
                    </Text>
                    <View style={[styles.listContainer, { marginLeft: 10 }]}>
                        {[
                            "participant", "authorised representative", "nominee", "guardian", "employee", "provider operations manager or director."
                        ].map((item, idx) => (
                            <View style={styles.listItem} key={idx}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.listItemText}>{item}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={[styles.sectionTitle, { fontSize: 12, marginTop: 10 }]}>Participant or authorised person</Text>
                    <Text style={[styles.bodyText, { marginBottom: 10 }]}>I acknowledge the following:</Text>

                    {[
                        "The details discussed and provided on this conflict of interest declaration form are correct to the best of my knowledge.",
                        "I understand the conflict of interest, the associated risks and management strategy set out in this declaration form.",
                        "I have been provided with options to raise my concerns if the circumstances set out in this declaration change.",
                        "I understand that personal information collected, managed and disclosed on this form will comply with requirements of the organisation’s privacy policy."
                    ].map((opt, idx) => {
                        // Default checkboxes to empty for template or based on data
                        return (
                            <View style={[styles.checkboxRow, { alignItems: 'flex-start', marginBottom: 8 }]} key={idx}>
                                <View style={[styles.checkboxBox, { marginTop: 2 }]}>
                                    {/* Logic for checked state */}
                                </View>
                                <Text style={{ fontSize: 10, width: '90%' }}>{opt}</Text>
                            </View>
                        )
                    })}

                    {/* Participant Signature Table */}
                    <View style={[styles.table, { marginTop: 15 }]}>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCellLabel, { backgroundColor: '#E5E7EB' }]}><Text>Participant name</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('participantName')}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCellLabel, { backgroundColor: '#E5E7EB' }]}><Text>Signature</Text></View>
                            <View style={[styles.tableCellValue, { height: 40 }]}></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCellLabel, { backgroundColor: '#E5E7EB' }]}><Text>Date (DD/MM/YYYY)</Text></View>
                            <View style={styles.tableCellValue}><Text>{today}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCellLabel, { backgroundColor: '#E5E7EB' }]}><Text>Authorised representative name</Text></View>
                            <View style={styles.tableCellValue}><Text></Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCellLabel, { backgroundColor: '#E5E7EB' }]}><Text>Signature</Text></View>
                            <View style={[styles.tableCellValue, { height: 40 }]}></View>
                        </View>
                        <View style={styles.tableRowLast}>
                            <View style={[styles.tableCellLabel, { backgroundColor: '#E5E7EB' }]}><Text>Date (DD/MM/YYYY)</Text></View>
                            <View style={styles.tableCellValue}><Text></Text></View>
                        </View>
                    </View>

                    <View break />

                    <Text style={[styles.sectionTitle, { fontSize: 12, marginTop: 20 }]}>Employee and provider operations manager or director</Text>
                    <Text style={[styles.bodyText, { marginBottom: 10 }]}>I declare the following:</Text>
                    <Text style={[styles.bodyText, { marginBottom: 5 }]}>I have provided the above named participant or authorised representative with:</Text>

                    {[
                        "a copy of this declaration form",
                        "any additional management plans",
                        "the organisation’s conflict of interest policy and procedures."
                    ].map((opt, idx) => (
                        <View style={[styles.checkboxRow, { marginBottom: 5, marginLeft: 15 }]} key={idx}>
                            <View style={styles.checkboxBox}></View>
                            <Text style={{ fontSize: 10 }}>{opt}</Text>
                        </View>
                    ))}

                    {[
                        "the details provided are correct to the best of my knowledge and I make this conflict of interest declaration in good faith.",
                        "I understand that if the circumstances as set out in this declaration change, I am required to complete a new declaration setting out the circumstances.",
                        "I acknowledge that this conflict of interest declaration and management plan will be reviewed:"
                    ].map((opt, idx) => (
                        <View style={[styles.checkboxRow, { alignItems: 'flex-start', marginBottom: 8, marginTop: idx === 0 ? 10 : 0 }]} key={idx}>
                            <View style={[styles.checkboxBox, { marginTop: 2 }]}>
                            </View>
                            <Text style={{ fontSize: 10, width: '90%' }}>{opt}</Text>
                        </View>
                    ))}

                    <View style={{ marginLeft: 30 }}>
                        <View style={[styles.checkboxRow, { marginBottom: 5 }]}>
                            <View style={styles.checkboxBox}></View>
                            <Text style={{ fontSize: 10 }}>within 6 months</Text>
                        </View>
                        <View style={[styles.checkboxRow, { marginBottom: 5 }]}>
                            <View style={[styles.checkboxBox, styles.checkboxChecked]}>
                                <Text style={styles.checkMark}>X</Text>
                            </View>
                            <Text style={{ fontSize: 10 }}>within 12 months</Text>
                        </View>
                    </View>

                    <View style={[styles.checkboxRow, { alignItems: 'flex-start', marginBottom: 15, marginTop: 5 }]}>
                        <View style={[styles.checkboxBox, { marginTop: 2 }]}>
                        </View>
                        <Text style={{ fontSize: 10, width: '90%' }}>
                            I understand that personal information collected, managed and disclosed on this form will comply with requirements of the organisation’s privacy policy.
                        </Text>
                    </View>

                    <Text style={{ fontSize: 10, marginBottom: 15 }}>
                        The <Link src="https://www.ndiscommission.gov.au/rules-and-standards/ndis-code-conduct" style={{ color: 'blue', textDecoration: 'underline' }}>NDIS Code of Conduct</Link> promotes safe and ethical service delivery by setting out expectations for the conduct of both NDIS providers and workers. If you don’t abide by the obligations to disclose and manage conflicts of interest, this may constitute a breach of the NDIS Code of Conduct which may result in a report to the NDIS Quality and Safeguards Commission or National Disability Insurance Agency for non-compliant behaviour.
                    </Text>

                    {/* Employee/Provider Signature Table */}
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCellLabel, { backgroundColor: '#E5E7EB' }]}><Text>Employee name</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('employeeName')}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCellLabel, { backgroundColor: '#E5E7EB' }]}><Text>Signature</Text></View>
                            <View style={[styles.tableCellValue, { height: 40 }]}></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCellLabel, { backgroundColor: '#E5E7EB' }]}><Text>Date (DD/MM/YYYY)</Text></View>
                            <View style={styles.tableCellValue}><Text>{today}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCellLabel, { backgroundColor: '#E5E7EB' }]}><Text>Operations manager or director name</Text></View>
                            <View style={styles.tableCellValue}><Text>{getFieldValue('providerRepName')}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCellLabel, { backgroundColor: '#E5E7EB' }]}><Text>Signature</Text></View>
                            <View style={[styles.tableCellValue, { height: 40 }]}>
                                {getFieldValue('providerSignature')?.startsWith('data:image') && (
                                    <Image src={getFieldValue('providerSignature')} style={{ height: 35, objectFit: 'contain' }} />
                                )}
                            </View>
                        </View>
                        <View style={styles.tableRowLast}>
                            <View style={[styles.tableCellLabel, { backgroundColor: '#E5E7EB' }]}><Text>Date (DD/MM/YYYY)</Text></View>
                            <View style={styles.tableCellValue}><Text>{today}</Text></View>
                        </View>
                    </View>


                </View>
                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>ndis.gov.au</Text>
                </View>
            </Page>
            {/* Page 5 - Contact Info */}
            <Page size="A4" style={styles.page}>
                <View style={[styles.contentContainer, { paddingTop: 60 }]}>
                    <Text style={{ fontSize: 18, color: NDIS_PURPLE, fontWeight: 'bold', marginBottom: 10 }}>National Disability Insurance Agency</Text>

                    <Link src="https://ndis.gov.au/" style={{ fontSize: 10, color: 'blue', textDecoration: 'underline', marginBottom: 20 }}>ndis.gov.au</Link>

                    <Text style={{ fontSize: 10, marginBottom: 10 }}>Telephone 1800 800 110</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ fontSize: 10 }}>Webchat </Text>
                        <Link src="https://ndis.gov.au/" style={{ fontSize: 10, color: 'blue', textDecoration: 'underline' }}>ndis.gov.au</Link>
                    </View>

                    <Text style={{ fontSize: 10, marginBottom: 10 }}>Follow us on our social channels:</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <Link src="https://www.facebook.com/NDISAus" style={{ fontSize: 10, color: 'blue', textDecoration: 'underline', marginRight: 5 }}>Facebook</Link>
                        <Text style={{ fontSize: 10, marginRight: 5 }}>,</Text>
                        <Link src="https://x.com/NDIS" style={{ fontSize: 10, color: 'blue', textDecoration: 'underline', marginRight: 5 }}>Twitter</Link>
                        <Text style={{ fontSize: 10, marginRight: 5 }}>,</Text>
                        <Link src="https://www.instagram.com/ndis_australia" style={{ fontSize: 10, color: 'blue', textDecoration: 'underline', marginRight: 5 }}>Instagram</Link>
                        <Text style={{ fontSize: 10, marginRight: 5 }}>,</Text>
                        <Link src="https://www.youtube.com/user/DisabilityCare" style={{ fontSize: 10, color: 'blue', textDecoration: 'underline', marginRight: 5 }}>YouTube</Link>
                        <Text style={{ fontSize: 10, marginRight: 5 }}>,</Text>
                        <Link src="https://www.linkedin.com/company/national-disability-insurance-agency" style={{ fontSize: 10, color: 'blue', textDecoration: 'underline' }}>LinkedIn</Link>
                    </View>

                    <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 10 }}>For people who need help with English</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>TIS: </Text>
                        <Text style={{ fontSize: 10 }}>131 450</Text>
                    </View>

                    <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 10 }}>For people who have hearing or speech loss</Text>

                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>TTY: </Text>
                        <Text style={{ fontSize: 10 }}>1800 555 677</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Voice relay: </Text>
                        <Text style={{ fontSize: 10 }}>1800 555 727</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>National Relay Service: </Text>
                        <Link src="https://www.accesshub.gov.au/" style={{ fontSize: 10, color: 'blue', textDecoration: 'underline' }}>relayservice.gov.au</Link>
                    </View>

                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>ndis.gov.au</Text>
                </View>
            </Page>
        </Document>
    );
};

export default ConflictOfInterest_MATCHING;
