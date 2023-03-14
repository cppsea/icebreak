import React, { useRef, useState, useEffect } from 'react';
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
    const [scrollOffset, setScrollOffset] = useState(0);
    const blueViewPosition = new Animated.ValueXY({ x: 0, y: 0 });

    // viewRefs.current to access the list
    // viewRefs.current[index].current to access the view
    const viewRefs = useRef([]);

    useEffect(() => {
        // Initialize viewRefs list with a ref for each view
        viewRefs.current = tabs.map(() => React.createRef());
    }, [tabs])

    function selectTab(tab) {
        setActiveTab(tab); 
        for (let index = 0; index < tabs.length; index++) {
            if (tabs[index] == activeTab && viewRefs.current[index].current) {
                viewRefs.current[index].current.measure((x, y, width, height, pageX, pageY) => {
                    // x is the top left, so use (x + width / 2) for the middle
                    console.log("Position of " + index.toString() + ": " + ( (x + width) / 2 + scrollOffset ).toString());

                    // This is running recursively?
                    // Animated.spring(blueViewPosition, {
                    //     toValue: { x: ( (x + width) / 2 + scrollOffset ), y: blueViewPosition.y },
                    //     useNativeDriver: false
                    // }).start();
                })
                
                break;
            }
        }
    }

    function handleScroll(event) {
        setScrollOffset(event.nativeEvent.contentOffset.x);
    }

    return (
        <View>
            <ScrollView 
                style={styles.tabGroup} 
                horizontal 
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={1000}
                onScroll={handleScroll}
                >
                <View style={styles.innerTabView}>
                    {tabs.map((tab, index) => (
                        <TouchableWithoutFeedback key={index} onPress={() => selectTab(tab)} >
                            <View style={{alignItems: 'center'}} ref={viewRefs.current[index]}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={[styles.tab, {color: activeTab.name === tab.name ? '#2C2C2C' : '#717171'}]}>{tab.name}</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    ))}
                </View>
            </ScrollView>

            <Animated.View style={[blueViewPosition.getLayout(), styles.blueView]}/>
            
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
    blueView: {
        width: 60, 
        height: 3, 
        backgroundColor: '#3498DB',
        marginTop: -2,
        borderRadius: 2
    }
});



export default GroupTabs;
