import PropTypes from "prop-types";
import React from "react";
import { TextInput, Button, View, Text, StyleSheet } from "react-native";

const TagInput = ({ value, setValue, tags, setTags, maxTags }) => {
  const addTag = () => {
    if (value && tags.length < maxTags && !tags.includes(value)) {
      setTags([...tags, value]);
      setValue("");
    }
  };

  const removeTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={(newText) => {
            setValue(newText);
          }}
          placeholder="Enter a tag"
          style={styles.input}
        />
        <Button
          title="Add Tag"
          onPress={addTag}
          disabled={tags.length >= maxTags}
        />
      </View>

      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <Button
              title="X"
              onPress={() => removeTag(index)}
              style={styles.removeButton}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const colors = {
  blue: "#ff0000",
  red: "#e0e0e0",
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  input: {
    borderWidth: 1,
    flex: 1,
    height: 40,
    margin: 6,
    padding: 10,
  },
  inputContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  removeButton: {
    backgroundColor: colors.blue,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  tag: {
    alignItems: "center",
    backgroundColor: colors.red,
    borderRadius: 8,
    flexDirection: "row",
    margin: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  tagText: {
    marginRight: 2,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

TagInput.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  setTags: PropTypes.func.isRequired,
  maxTags: PropTypes.number.isRequired,
};

export default TagInput;
