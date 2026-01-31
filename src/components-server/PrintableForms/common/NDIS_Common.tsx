import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

export const NDIS_PURPLE = '#5B2C6F';
export const NDIS_GREEN = '#A5C831';

export const ndisCommonStyles = StyleSheet.create({
    headerStatic: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    formLabel: {
        fontSize: 22,
        fontWeight: 'bold',
        color: NDIS_PURPLE,
    },
    ndisLogoBg: {
        width: 72,
        height: 44,
        backgroundColor: NDIS_PURPLE,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 28,
        paddingLeft: 6,
        justifyContent: 'center',
        position: 'relative',
    },
    logoTextContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: '100%',
        paddingBottom: 7,
    },
    logoLetter: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
        lineHeight: 1,
        letterSpacing: -1,
    },
    logoIWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 0,
        marginBottom: 1,
    },
    logoIDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: NDIS_GREEN,
        marginBottom: 0.5,
    },
    logoIStem: {
        width: 6.5,
        height: 13.5,
        backgroundColor: 'white',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    checkboxBox: {
        width: 14,
        height: 14,
        borderWidth: 1.5,
        borderColor: NDIS_PURPLE,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    checkboxChecked: {
        backgroundColor: '#F3E8FF', // Light purple
    },
    checkMark: {
        color: NDIS_PURPLE,
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        lineHeight: 1,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    pageNumber: {
        fontSize: 10,
        color: '#666666',
        marginTop: 5,
        fontFamily: 'Helvetica-Bold',
    },
});

export const NDISLogo = () => (
    <View style={ndisCommonStyles.ndisLogoBg}>
        <View style={ndisCommonStyles.logoTextContainer}>
            <Text style={ndisCommonStyles.logoLetter}>nd</Text>
            <View style={ndisCommonStyles.logoIWrapper}>
                <View style={ndisCommonStyles.logoIDot} />
                <View style={ndisCommonStyles.logoIStem} />
            </View>
            <Text style={ndisCommonStyles.logoLetter}>s</Text>
        </View>
    </View>
);

export const NDISHeader = ({ title = "Form" }: { title?: string }) => (
    <View style={ndisCommonStyles.headerStatic} fixed>
        <Text style={ndisCommonStyles.formLabel}>{title}</Text>
        <NDISLogo />
    </View>
);

export const NDISFooter = () => (
    <View style={ndisCommonStyles.footerContainer} fixed>
        <Text
            style={ndisCommonStyles.pageNumber}
            render={({ pageNumber }) => `${pageNumber}`}
        />
    </View>
);

export const NDISCheckbox = ({ checked }: { checked: boolean }) => (
    <View style={[ndisCommonStyles.checkboxBox, checked ? ndisCommonStyles.checkboxChecked : {}]}>
        {checked && <Text style={ndisCommonStyles.checkMark}>X</Text>}
    </View>
);
