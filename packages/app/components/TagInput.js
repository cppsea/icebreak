import React, { useState } from 'react';
import { TextInput, Button, View, Text, StyleSheet } from 'react-native';

const TagInput = ({ value, setValue, tags, setTags, maxTags }) => {
  const addTag = () => {
    if (value && tags.length < maxTags && !tags.includes(value)) {
      setTags([...tags, value]);
      setValue('');
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
          onChangeText={setValue}
          placeholder="Enter a tag"
          style={styles.input}
        />
        <Button title="Add Tag" onPress={addTag} disabled={tags.length >= maxTags} />
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 40,
    margin: 6,
    borderWidth: 1,
    padding: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 1,
    paddingHorizontal: 4,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    marginRight: 2,
  },
  removeButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
});

export default TagInput;
