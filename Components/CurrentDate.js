import { StyleSheet, Text, View } from "react-native";
import { React, useEffect, useState } from "react";

// Get the color of the text and size of the text from props
export default function CurrentDate({ textColor, textSize }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Date
  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 600000);
    // Clear interval
    return () => clearInterval(interval);
  }, []);

  var today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  return (
    <View>
      <Text
        style={[
          styles.dateText,
          {
            // color and fontSize from props
            color: textColor,
            fontSize: textSize,
          },
        ]}
      >
        {currentDate.toLocaleDateString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dateText: {
    fontSize: 16,
    color: "black",
  },
});
