import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function ArticleCard({
  title,
  author,
  text,
  publishedDate,
  source,
}) {
  return (
    <View style={styles.cardContainer}>
      {/* Get the article title, source, author, text, and publication date from props */}
      <Text style={styles.titleText}>{title}</Text>
      <Text></Text>
      <Text style={styles.sourceText}>{source}</Text>
      <Text></Text>
      <Text style={styles.authorText}>{author}</Text>
      <Text style={styles.sourceText}>{publishedDate}</Text>
      <Text></Text>
      <Text style={styles.bodyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    //flex: 1,
    width: 250,
    height: 250,
    backgroundColor: "black",
    padding: 10,
    margin: 10,
    borderRadius: 15,
    borderStyle: "dotted",
    borderColor: "white",
    borderWidth: 2,
    overflow: "hidden",
  },
  titleText: {
    color: "white",
    fontSize: 12,
    fontStyle: "italic",
  },
  authorText: {
    color: "cyan",
    fontSize: 10,
  },
  bodyText: {
    color: "white",
    fontSize: 10,
  },
  sourceText: {
    color: "white",
    fontSize: 8,
  },
});
