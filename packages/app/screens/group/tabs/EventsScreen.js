import EventCard from '@app/components/EventCard/EventCard';
import React, { useRef, useState } from 'react';
import { View, SectionList, StyleSheet, Text } from 'react-native';

const mockData = [
    {
        title: 'Wednesday, April 6',
        data: ['Pizza', 'Burger', 'Risotto']
    },
    {
        title: 'Friday, April 8',
        data: ['Pizza', 'Burger']
    },
    {
        title: 'Sunday, April 10',
        data: ['Pizza']
    }
]

function EventsScreen() {
    return(
        <View style={styles.container}>
            <SectionList
                stickySectionHeadersEnabled={false}
                sections={mockData}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => (
                    <EventCard 
                        style={styles.card}
                        banner={require("@app/assets/test_card_banner.png")}
                        title="Test" 
                        timeBegin="test"
                        timeEnd="test"
                        location="test"
                        description="test"
                    />
                )}
                renderSectionHeader={({section: {title}}) => (
                    <Text style={styles.header}>{title}</Text>
                )}
            />
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        height: 450
    },
    header: {
        fontSize: 20,
        color: '#2C2C2C',
        fontWeight: '700',
        backgroundColor: '',
        margin: 5
    },
    card: {
        marginTop: 10,
        marginBottom: 10
    }
});

export default EventsScreen;