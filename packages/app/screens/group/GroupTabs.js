import React, { useRef, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

function GroupTabs() {
    const tabs = ['Events', 'Members', 'Leaderboard', 'About', 'Newsletter'];
    const [activeTab, setActiveTab] = useState('Events');
    const moveAnimation = useRef(new Animated.Value(0)).current;
  
    const selectTab = (tabName) => {
      setActiveTab(tabName)
      console.log(tabName)
    };


    return (
      <ScrollView style={styles.tabGroup} horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row'}}>
            {tabs.map((tab, index) => (
                <TouchableWithoutFeedback onPress={() => selectTab(tab)}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.tab, {color: activeTab === tab ? '#2C2C2C' : '#717171'}]}>{tab}</Text>
                    </View>
                </TouchableWithoutFeedback>
            ))}
        </View>
      </ScrollView>
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
    }
});



export default GroupTabs;
