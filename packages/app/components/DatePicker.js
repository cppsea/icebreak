import React, { useState } from "react";
import { Button, View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";

function DatePicker() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onButtonPress = () => {
    setShowPicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  return (
    <View>
      <Button title="Open Date Picker" onPress={onButtonPress} />
      {showPicker && <RNDateTimePicker value={date} onChange={onDateChange} />}
    </View>
  );
}

export default DatePicker;
