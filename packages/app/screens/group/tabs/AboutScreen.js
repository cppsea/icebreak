import React from 'react';
import {View, Text} from 'react-native';

function AboutScreen(){
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Description</Text>
          <Text style={styles.description}>
            Welcome to our YouTube channel! We create and share exciting content about various topics that you'll love.
          </Text>
          <Text style={styles.subscribers}> 968 members</Text>
          <View style={styles.linksSection}>
            <TouchableOpacity style={styles.link}>
              <Text style={styles.linkText}>Visit our website</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link}>
              <Text style={styles.linkText}>Subscribe to our channel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link}>
              <Text style={styles.linkText}>Follow us on social media</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.moreInfoSection}>
            <Text style={styles.moreInfoTitle}>More Information</Text>
          </View>
        </View>
      );

      const HyperlinkButton = () => {
        return (
          <a href="https://example.com/" target="_blank" rel="noopener noreferrer">
            Click me
          </a>
        );
      };

      const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: 20,
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
        },
        description: {
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 20,
        },
        subscribers: {
          fontSize: 18,
          color: '#606060',
          marginBottom: 20,
        },
        linksSection: {
          width: '100%',
          marginBottom: 20,
        },
        link: {
          backgroundColor: '#e6e6e6',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        },
        linkText: {
          textAlign: 'center',
          color: '#333333',
        },
        moreInfoSection: {
          width: '100%',
        },
        moreInfoTitle: {
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        moreInfoText: {
          fontSize: 16,
          textAlign: 'center',
        },
      });
    
}

export default AboutScreen;