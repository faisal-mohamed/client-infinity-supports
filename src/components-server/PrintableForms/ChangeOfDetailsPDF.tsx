"use client";

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#333' },
    header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#5B2C6F', paddingBottom: 10 },
    title: { fontSize: 18, color: '#5B2C6F', fontWeight: 'bold', marginBottom: 5 },
    section: { marginBottom: 15 },
    sectionTitle: { fontSize: 12, color: '#5B2C6F', fontWeight: 'bold', backgroundColor: '#F4ECF7', padding: 5, marginBottom: 8 },
    row: { flexDirection: 'row', marginBottom: 4 },
    label: { width: '30%', fontWeight: 'bold', color: '#555' },
    value: { width: '70%', color: '#000' },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    checkbox: { width: 12, hieght: 12, borderWidth: 1, borderColor: '#5B2C6F', marginRight: 5, alignItems: 'center', justifyContent: 'center' },
    checkboxInner: { fontSize: 8, color: '#5B2C6F', fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10, fontSize: 8, color: '#999', textAlign: 'center' },
    signatureBox: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#CCC', paddingTop: 10, width: '45%' },
    signatureImage: { width: 150, height: 60, marginBottom: 5 }
});

const ChangeOfDetailsPDF: React.FC<any> = ({ formData, commonFieldsData }) => {
    const renderField = (label: string, value: any) => (
        <View style={styles.row}>
            <Text style={styles.label}>{label}:</Text>
            <Text style={styles.value}>{value || "Not provided"}</Text>
        </View>
    );

    const isChecked = (field: string, option: string) => {
        const val = formData[field];
        if (Array.isArray(val)) return val.includes(option);
        return val === option;
    };

    const CheckBox = ({ selected }: { selected: boolean }) => (
        <View style={styles.checkbox}>
            {selected && <Text style={styles.checkboxInner}>X</Text>}
        </View>
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Change of Details or Change of Situation</Text>
                    <Text>Infinity Supports WA Pty Ltd</Text>
                </View>

                {/* Part A */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Part A: Person’s details</Text>
                    {renderField("Full Name", formData.fullName || commonFieldsData.fullName)}
                    {renderField("Date of Birth", formData.dob || commonFieldsData.dob)}
                    {renderField("NDIS Number", formData.ndisNumber || commonFieldsData.ndis)}
                    {renderField("Contact Details", formData.contactDetails || commonFieldsData.phone || commonFieldsData.email)}
                </View>

                {/* Part B */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Part B: Third party details</Text>
                    {renderField("Full Name", formData.thirdPartyName)}
                    {renderField("Date of Birth", formData.thirdPartyDob)}
                    {renderField("Phone Number", formData.thirdPartyPhone)}
                    {renderField("Relationship", formData.thirdPartyRelationship)}
                </View>

                {/* Part C */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Part C: Information about what has changed</Text>
                    {[
                        "My contact details have changed – Go to Part D",
                        "My plan has an error – Go to Part E",
                        "I would like the reassessment date of my plan changed – Go to Part F",
                        "I want to change how the funding is managed in my plan – Go to Part G",
                        "My situation has changed – Go to Part H"
                    ].map(option => (
                        <View key={option} style={styles.checkboxRow}>
                            <CheckBox selected={isChecked("changes", option)} />
                            <Text>{option}</Text>
                        </View>
                    ))}
                </View>

                {/* Part D */}
                {isChecked("changes", "My contact details have changed – Go to Part D") && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Part D: Your contact details have changed</Text>
                        {renderField("New Address", formData.newAddress)}
                        {renderField("New Phone", formData.newPhone)}
                        {renderField("New Email", formData.newEmail)}
                        <View style={styles.row}>
                            <Text style={styles.label}>Change Type:</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <CheckBox selected={formData.changeType === "Permanent"} /><Text style={{ marginRight: 10 }}>Permanent</Text>
                                <CheckBox selected={formData.changeType === "Temporary"} /><Text>Temporary</Text>
                            </View>
                        </View>
                        {renderField("Start Date", formData.partD_startDate)}
                        {formData.changeType === "Temporary" && renderField("End Date", formData.partD_endDate)}
                    </View>
                )}

                {/* Part E */}
                {isChecked("changes", "My plan has an error – Go to Part E") && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Part E: My plan has an error</Text>
                        <Text>{formData.errorDescription || "No description provided."}</Text>
                    </View>
                )}

                {/* Part F */}
                {isChecked("changes", "I would like the reassessment date of my plan changed – Go to Part F") && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Part F: Reassessment date change</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Correction Type:</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <CheckBox selected={isChecked("reassessmentDateType", "Extended")} /><Text style={{ marginRight: 10 }}>Extended</Text>
                                <CheckBox selected={isChecked("reassessmentDateType", "Shortened")} /><Text>Shortened</Text>
                            </View>
                        </View>
                        {renderField("Reason", formData.reassessmentReason)}
                    </View>
                )}

                {/* Part G */}
                {isChecked("changes", "I want to change how the funding is managed in my plan – Go to Part G") && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Part G: Funding management change</Text>

                        <Text style={[styles.label, { marginBottom: 5, fontSize: 10, color: '#5B2C6F' }]}>Registered Plan Manager:</Text>
                        <View style={styles.checkboxRow}>
                            <CheckBox selected={isChecked("rpm_Managed", "All supports")} /><Text style={{ marginRight: 10 }}>All supports</Text>
                            <CheckBox selected={isChecked("rpm_Managed", "Specific supports - please list supports below:")} /><Text>Specific supports</Text>
                        </View>
                        {isChecked("rpm_Managed", "Specific supports - please list supports below:") && (
                            <Text style={[styles.value, { marginLeft: 15, marginBottom: 10, fontSize: 9, color: '#444' }]}>{formData.rpm_Details || "No details provided"}</Text>
                        )}

                        <Text style={[styles.label, { marginBottom: 5, marginTop: 10, fontSize: 10, color: '#5B2C6F' }]}>Self-Managed:</Text>
                        <View style={styles.checkboxRow}>
                            <CheckBox selected={isChecked("sm_Managed", "All supports")} /><Text style={{ marginRight: 10 }}>All supports</Text>
                            <CheckBox selected={isChecked("sm_Managed", "Specific supports - please list supports below:")} /><Text>Specific supports</Text>
                        </View>
                        {isChecked("sm_Managed", "Specific supports - please list supports below:") && (
                            <Text style={[styles.value, { marginLeft: 15, marginBottom: 10, fontSize: 9, color: '#444' }]}>{formData.sm_Details || "No details provided"}</Text>
                        )}

                        <Text style={[styles.label, { marginBottom: 5, marginTop: 10, fontSize: 10, color: '#5B2C6F' }]}>Agency Managed:</Text>
                        <View style={styles.checkboxRow}>
                            <CheckBox selected={isChecked("agency_Managed", "All supports")} /><Text style={{ marginRight: 10 }}>All supports</Text>
                            <CheckBox selected={isChecked("agency_Managed", "Specific supports - please list supports below:")} /><Text>Specific supports</Text>
                        </View>
                        {isChecked("agency_Managed", "Specific supports - please list supports below:") && (
                            <Text style={[styles.value, { marginLeft: 15, marginBottom: 10, fontSize: 9, color: '#444' }]}>{formData.agency_Details || "No details provided"}</Text>
                        )}
                    </View>
                )}

                {/* Part H */}
                {isChecked("changes", "My situation has changed – Go to Part H") && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Part H: My situation has changed</Text>

                        <Text style={styles.label}>Type of change:</Text>
                        {[
                            "There have been small changes to my situation",
                            "There have been large changes to my situation",
                            "I need more or different supports urgently"
                        ].map(opt => (
                            <View key={opt} style={styles.checkboxRow}>
                                <CheckBox selected={isChecked("situationChangeType", opt)} />
                                <Text>{opt}</Text>
                            </View>
                        ))}

                        <Text style={[styles.label, { marginTop: 10 }]}>Request Type:</Text>
                        {[
                            "Plan Variation",
                            "Plan Reassessment",
                            "Not sure. If you’re not sure, we will contact you to discuss your situation."
                        ].map(opt => (
                            <View key={opt} style={styles.checkboxRow}>
                                <CheckBox selected={isChecked("planChangeRequest", opt)} />
                                <Text>{opt}</Text>
                            </View>
                        ))}

                        {renderField("Description", formData.changeDescription)}
                        {renderField("Reason", formData.changeReason)}
                        {renderField("Other Supports", formData.otherSupports)}

                        <View style={[styles.row, { marginTop: 10 }]}>
                            <Text style={styles.label}>Additional Info:</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <CheckBox selected={isChecked("additionalInfo", "Yes")} /><Text style={{ marginRight: 10 }}>Yes</Text>
                                <CheckBox selected={isChecked("additionalInfo", "No")} /><Text>No</Text>
                            </View>
                        </View>
                        {isChecked("additionalInfo", "Yes") && (
                            <Text style={[styles.value, { marginLeft: 15 }]}>{formData.additionalInfoDetails || "No details provided"}</Text>
                        )}

                        {renderField("Start Date", formData.partH_startDate)}

                        <Text style={[styles.label, { marginTop: 10 }]}>End Date:</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {["Under 1 month", "Under 3 months", "Under 6 months", "Permanent"].map(opt => (
                                <View key={opt} style={{ flexDirection: 'row', marginRight: 15, marginBottom: 5 }}>
                                    <CheckBox selected={isChecked("partH_endDate", opt)} />
                                    <Text>{opt}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Declaration & Signature */}
                <View style={{ marginTop: 20 }}>
                    <Text style={[styles.sectionTitle, { backgroundColor: '#FDF2E9', color: '#A04000' }]}>Part I: Your declaration</Text>
                    <Text style={{ fontSize: 9, marginBottom: 10 }}>
                        I confirm that the information provided in this form is complete and correct.
                        I understand that giving false or misleading information is a serious offence.
                    </Text>
                    {renderField("Full Name", formData.declarationName)}
                    {renderField("Date", formData.partI_declarationDate)}

                    <View style={styles.signatureBox}>
                        <Text style={{ fontSize: 8, marginBottom: 5 }}>Signature:</Text>
                        {formData.signature ? (
                            <Image src={formData.signature} style={styles.signatureImage} />
                        ) : (
                            <View style={[styles.signatureImage, { borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC' }]} />
                        )}
                    </View>
                </View>

                <Text style={styles.footer}>Infinity Supports WA Pty Ltd | ABN: 45 655 038 074</Text>
            </Page>
        </Document>
    );
};

export default ChangeOfDetailsPDF;
