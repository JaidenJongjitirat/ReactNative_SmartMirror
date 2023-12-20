import { StyleSheet, Text, View } from "react-native";
import { React, useEffect, useState } from "react";

// Get the color of the text and size of the text from props
export default function CurrentTime({ textColor, textSize }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Time
  useEffect(() => {
    // Update every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear interval
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View>
      <Text
        style={[
          styles.timeText,
          {
            // color and fontSize from props
            color: textColor,
            fontSize: textSize,
          },
        ]}
      >
        {currentTime.toLocaleTimeString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timeText: {
    fontSize: 16,
    color: "black",
  },
});
