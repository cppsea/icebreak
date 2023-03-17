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

const blueViewWidth = 60;
const blueViewPosition = new Animated.ValueXY({ x: 0, y: -1 });

function GroupTabs() {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [scrollOffset, setScrollOffset] = useState(0);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);

    // viewRefs.current to access the list
    // viewRefs.current[index].current to access the view
    const viewRefs = useRef([]);


    useEffect(() => {
        // Initialize viewRefs list with a ref for each view
        viewRefs.current = tabs.map(() => React.createRef())
    }, [tabs])

    
    useEffect(() => {
        getPosition().then((position) => {
            Animated.spring(blueViewPosition, {
                toValue: { x: position, y: blueViewPosition.y },
                useNativeDriver: false,
                config: {
                    speed: 1
                }
            }).start(() => {
                setTimeout(() => {
                    setIsAnimationComplete(true);
                }, 700)
            });
        }).catch((error) => {
            console.log(error);
        });
    }, [activeTab, scrollOffset])


    function getPosition() {
        return new Promise((resolve, reject) => {
            for (let index = 0; index < tabs.length; index++) {
                if (tabs[index] == activeTab && viewRefs.current[index].current) {
                    let position;
                    viewRefs.current[index].current.measure((x, y, width, height, pageX, pageY) => {
                    position = (x + width / 2 - scrollOffset - blueViewWidth / 2) + 5;
                    resolve(position);
                    });
                    return;
                }
            }
            reject(new Error('Could not find active tab or view ref'));
        });
    }

    function selectTab(tab) {
        setActiveTab(tab); 
        setIsAnimationComplete(false)
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
                scrollEventThrottle={100}
                onScroll={handleScroll}
                >
                <View style={styles.innerTabView}>
                    {tabs.map((tab, index) => (
                        <TouchableWithoutFeedback 
                            key={index} 
                            onPress={() => {
                                selectTab(tab)
                            }} 
                        >
                            <View style={{alignItems: 'center'}} ref={viewRefs.current[index]}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={[styles.tab, {color: activeTab.name === tab.name ? '#2C2C2C' : '#717171'}]}>{tab.name}</Text>
                                </View>

                                {activeTab == tab && <View style={[styles.staticBlueView, isAnimationComplete ? {} : {opacity: 0}]} />}
                            </View>
                        </TouchableWithoutFeedback>
                        
                    ))}
                </View>
            </ScrollView>

            <Animated.View style={[blueViewPosition.getLayout(), styles.blueView, isAnimationComplete ? {opacity: 0} : { }]}/>
            
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
        width: blueViewWidth, 
        height: 3, 
        backgroundColor: '#3498DB',
        marginTop: -2,
        borderRadius: 2
    },
    staticBlueView: {
        width: blueViewWidth, 
        height: 3, 
        backgroundColor: '#3498DB',
        marginBottom: -15,
        borderRadius: 2,
    }
});

export default GroupTabs;
