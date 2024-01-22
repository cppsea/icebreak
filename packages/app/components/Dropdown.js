import PropTypes from "prop-types";
import React, { useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Dropdown = ({ options, value, setValue, setDropdownError }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setValue(option);
    setIsOpen(false);
    if (setDropdownError != null) {
      setDropdownError("");
    }
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownButtonText}>
          {value || "Select an option"}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <ScrollView style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionButton}
              onPress={() => selectOption(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const colors = {
  white: "#fff",
  grey: "#ccc",
  black: "#333",
};

const styles = StyleSheet.create({
  dropdownButton: {
    borderColor: colors.grey,
    borderRadius: 4,
    borderWidth: 1,
    padding: 10,
  },
  dropdownButtonText: {
    color: colors.blue,
    fontSize: 16,
  },
  dropdownContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    padding: 10,
  },
  optionButton: {
    padding: 10,
  },
  optionText: {
    color: colors.blue,
    fontSize: 16,
  },
  optionsContainer: {
    marginTop: 10,
    maxHeight: 200,
  },
});

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string]))
    .isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  setDropdownError: PropTypes.func.isRequired,
};

export default Dropdown;
