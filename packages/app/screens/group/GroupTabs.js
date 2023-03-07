import React, { useRef, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import EventsScreen from './tabs/EventsScreen';
import MembersScreen from './tabs/MembersScreen';
import LeaderboardScreen from './tabs/LeaderboardScreen';
import AboutScreen from './tabs/AboutScreen';
import NewsletterScreen from './tabs/NewsletterScreen';

const tabs = [
    {name: 'Events',
     screen: EventsScreen}, 
    {name: 'Members',
     screen: MembersScreen}, 
    {name: 'Leaderboard',
     screen: LeaderboardScreen},
    {name: 'About',
     screen: AboutScreen},
    {name: 'Newsletter',
     screen: NewsletterScreen},
]


function GroupTabs() {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    

    function setTab(tab) {
        setActiveTab(tab); 
        console.log("Active tab: " + activeTab.screen);
    }
    return (
        <View>
            <ScrollView style={styles.tabGroup} horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.innerTabView}>
                    {tabs.map((tab, index) => (
                        <TouchableWithoutFeedback key={index} onPress={() => setTab(tab)}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.tab, {color: activeTab.name === tab.name ? '#2C2C2C' : '#717171'}]}>{tab.name}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    ))}
                </View>
            </ScrollView>
            
            { activeTab.screen && <activeTab.screen /> }
        </View>
    );
}

const styles = StyleSheet.create({
    tab: {
        fontWeight: '600',
        padding: 10
    },
    tabGroup: {
        borderBottomColor: '#E4E4E4',
        borderBottomWidth: 3,
        marginLeft: 5,
        marginRight: 5
    },
    innerTabView: {
        flexDirection: 'row',
    },
});



export default GroupTabs;
