import React from 'react';
import RoundedIcon from "@app/components/MemberCard/RoundedIcon";
import PropTypes from "prop-types";
import { Platform, StyleSheet, Text, View } from "react-native";
import { ThreeDotsButton } from "./MemberFunctions";

const containerBG = "rgb(245, 245, 245)";
const shadow = "rgba(0, 0, 0, 0.25)";
const nameColor = "rgb(51,51,51)";

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: containerBG,
        borderRadius: 10,
        elevation: 1,
        flexDirection: "row",
        height: 60,
        justifyContent: "space-between",
        margin: 5,
        padding: 10,
        ...Platform.select({
            ios: {
                shadowColor: shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    name: {
        alignItems: "center",
        color: nameColor,
        flex: 1,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
});

const MemberCard = ({ name }) => {
    return (
    <View>
        <View style={styles.container}>
            <RoundedIcon /*image={SOMETHING}*/ />
            <Text style={styles.name}>{name}</Text>
            <ThreeDotsButton />
        </View>
    </View>
    );
};

MemberCard.propTypes = {
    name: PropTypes.string,
};

export default MemberCard;