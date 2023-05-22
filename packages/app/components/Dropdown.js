import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';

const Dropdown = ({ data }) => {

    // id, name
    return (
        <TouchableOpacity
        style={styles.dropDownStyle}
        activeOpacity={0.8}>
            <Text>Choose an options</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    dropDownStyle: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 8,
        borderRadius: 6,
        minHeight: 42,
        alignItems: 'center',
    },
});

export default Dropdown;