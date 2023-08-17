import EventCard from '@app/components/EventCard/EventCard';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

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


function EventsScreen(props) {

    return(
        <View style={[props.style, styles.container]} testID={props.testID}>
            {mockData.map((section) => (
                <View key={section.title}>
                <Text style={styles.header}>{section.title}</Text>
                {section.data.map((item, index) => (
                    <EventCard
                    key={index}
                    style={styles.card}
                    banner={require("@app/assets/test_card_banner.png")}
                    title="Test"
                    timeBegin="test"
                    timeEnd="test"
                    location="test"
                    description="test"
                    />
                ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    header: {
        fontSize: 20,
        color: '#2C2C2C',
        fontWeight: '700',
        backgroundColor: '#F5F5F5',
    },
    card: {
        marginTop: 10,
        marginBottom: 10
    }
});

export default EventsScreen;