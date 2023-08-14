import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const Dropdown = ({options, value, setValue, setDropdownError}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setValue(option);
    setIsOpen(false);
    if(setDropdownError != null)
    {
      setDropdownError('');
    }
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={toggleDropdown}
      >
        <Text style={styles.dropdownButtonText}>
          {value || 'Select an option'}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <ScrollView style={styles.optionsContainer}>
          {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionButton}
                onPress={() => selectOption(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 10,
  },
  dropdownButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  optionsContainer: {
    marginTop: 10,
    maxHeight: 200,
  },
  optionButton: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Dropdown;