import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Linking,
} from "react-native";
import { React, useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import axios from "axios";

// API keys
import { WEATHER_API_KEY } from "/key";
import { NEWS_API_KEY } from "/key";

// Icons and weatherStyles
import { Ionicons } from "@expo/vector-icons";
// Place the weatherStyles file in "assets" or any other folder you'd like
import { weatherStyles } from "./assets/weatherStyles";

//Components
import CurrentTime from "./Components/CurrentTime";
import CurrentDate from "./Components/CurrentDate";
import ArticleCard from "./Components/ArticleCard";

export default function App() {
  // API data
  const [weatherData, setWeatherData] = useState();
  const [newsData, setNewsData] = useState([]);

  // For automatic scrolling for articles
  const flatListRef = useRef();
  const [scrollX, setScrollX] = useState(0);

  // Location
  const [location, setLocation] = useState();

  // Get location Permission
  useEffect(() => {
    const getPermissions = async () => {
      // Ask for loaction permission while using the app
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync();
      // Save API response in state variable "location"
      setLocation(currentLocation);
    };
    getPermissions();
  }, []); // Empty dependency array so locations is only asked for once

  // Get weather data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!location) {
          console.log("Location not available yet");
          return;
        }
        const weatherResponse = await axios.get(
          // Weather API
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=imperial&appid=${WEATHER_API_KEY}`
        );
        // Save weather API response in state variable "weatherData"
        setWeatherData(weatherResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // The state variable "location" is in the dependency array, when "location" changes or is updated
    // the useEffect to fetch data from the API is ran again
  }, [location]);

  // get news articles
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await axios.get(
          // Get 15 articles, set the language to English, sort by publishedAt (most recent articles),
          // and the topic to get articles from is set to "everything"
          // The search query can be changed by either changing "everything" to another search term
          // or by using ${} to pass a variable to it. This can be used to users can enter a specific topic
          // to get articles about.
          `https://newsapi.org/v2/everything?q=everything&sortBy=publishedAt&pageSize=15&language=en&apiKey=${NEWS_API_KEY}`
        );

        // Save API response in state variable "newsData"
        setNewsData(response.data.articles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNewsData();
  }, []);

  // Autoscroll
  useEffect(() => {
    // set currentIndex to 0, the first index of the FlatList
    let currentIndex = 0;

    // Width of the ArticleCard
    const itemWidth = 250;

    const scrollInterval = setInterval(() => {
      setScrollX(() => {
        // Set nextIndex to currentIndex + 1
        // % is used to set currentIndex back to 0 (first article in FlatList),
        // if currentIndex is at the last article. It loops/wraps back to the start
        const nextIndex = (currentIndex + 1) % newsData.length;
        const nextOffset = (currentIndex + 1) * itemWidth;

        // Scroll to the next item
        flatListRef.current.scrollToIndex({
          animated: true, // Animated scroll
          offset: nextOffset,
          index: nextIndex,
        });

        currentIndex = nextIndex; // Update currentIndex

        return currentIndex; // Set scrollX to the currentIndex
      });
    }, 5000); // Every x seconds, scroll to the next article

    return () => clearInterval(scrollInterval);
  }, [newsData]);

  // Handle article Press
  const handleArticlePress = (url) => {
    Linking.openURL(url);
  };

  // Change tempText color based on temp
  const getTempColorStyle = (temp) => {
    // if the current temperature is greater than or equal to 80
    if (parseFloat(temp) >= 80) {
      return { color: "red" }; // return the style which will make the temp text red
    }
    // if the current temperature is greater than or equal to 70
    if (parseFloat(temp) >= 70) {
      return { color: "orange" }; // return the style which will make the temp text orange
    }
    // if the current temperature is greater than or equal to 65
    if (parseFloat(temp) >= 65) {
      return { color: "yellow" }; // return the style which will make the temp text yellow
    }
    // if the current temperature is greater than or equal to 55
    if (parseFloat(temp) >= 55) {
      return { color: "white" }; // return the style which will make the temp text white
    }
    // if the current temperature is greater than or equal to 49
    if (parseFloat(temp) >= 49) {
      return { color: "rgb(0, 116, 255)" }; // return the style which will make the temp text blue
    } else {
      // Colder than 45 degrees F
      return { color: "rgb(67, 175, 255)" }; // return the style which will make the temp text light blue
    }
  };

  return (
    <SafeAreaView style={styles.mirrorWeatherContainer}>
      <StatusBar hidden={true} />
      {/* Time and Weather */}
      <View style={styles.Header}>
        <CurrentDate textColor={"white"} textSize={16} />
        {/* If weatherData has loaded, then render this view */}
        {weatherData ? (
          <View style={styles.centerContainer}>
            <View style={styles.rowView}>
              <Text style={styles.cityText}>{weatherData.name} | </Text>
              <Text
                style={[
                  styles.tempText,
                  getTempColorStyle(weatherData.main.temp), // Run the getTempColorStyle function
                ]}
              >
                {weatherData.main.temp}˚F
              </Text>
            </View>
            <View style={styles.centerContainer}>
              <CurrentTime textColor={"white"} textSize={48} />
            </View>
          </View>
        ) : (
          // If weatherData hasn't loaded, render the loading text
          <Text style={styles.loadingText}>Weather Loading...</Text>
        )}
      </View>

      {/* Icon */}
      <View
        style={[
          styles.centerContainer,
          { flexDirection: "column", marginBottom: 150 },
        ]}
      >
        {/* Again, if weatherData has loaded, then render this view */}
        {weatherData ? (
          <View>
            <Text
              style={[
                styles.title,
                { color: weatherStyles[weatherData.weather[0].main]?.color },
              ]}
            >
              {/* Switch statement to choose which weather text to display */}
              {(() => {
                switch (weatherData.weather[0].main) {
                  case "Rain":
                    return `Rainy`;
                  case "Clear":
                    // Invisible character to help align the "Clear" text with the sunny icon
                    return `Clear ‎ `;
                  case "Mist":
                    return `Misty`;
                  case "Clouds":
                    return `Cloudy`;
                  case "Snow":
                    return `Snowy`;
                  default:
                    return "Weather Type Unknown";
                }
              })()}
            </Text>
            <Text style={styles.iconGlow}>
              <Ionicons
                // Get the icon name from weatherStyles based on the weather condition
                name={weatherStyles[weatherData.weather[0].main]?.icon}
                size={200}
                // Get the color from weatherStyles
                color={weatherStyles[weatherData.weather[0].main]?.color}
                style={{
                  textShadowColor:
                    // Get the backgroundColor from weatherStyles
                    weatherStyles[weatherData.weather[0].main]?.backgroundColor,
                  textShadowRadius: 15,
                  textShadowOffset: { width: 2, height: 2 },
                }}
              />
            </Text>
          </View>
        ) : (
          // Again, if weatherData hasn't loaded, render the loading text
          <Text>Loading...</Text>
        )}
      </View>

      {/* Body / Articles*/}
      <View style={styles.Body}>
        <View>
          {/* If newsData has loaded, then render this view */}
          {newsData ? (
            <View>
              <FlatList
                ref={(ref) => {
                  flatListRef.current = ref;
                }}
                horizontal={true}
                data={newsData} // Provide the newsData array to the data prop
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleArticlePress(item.url)}
                  >
                    {/* Take the article info from "data" and pass it to the ArticleCard via props */}
                    <ArticleCard
                      title={item.title}
                      author={item.author}
                      text={item.description}
                      publishedDate={item.publishedAt}
                      source={item.url}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                onScroll={(event) => {
                  const { contentOffset } = event.nativeEvent;
                  setScrollX(contentOffset.x);
                }}
                pagingEnabled={true}
                style={{
                  width: 270, // 20 pixels larger than the ArticleCard component, to give it some space
                  height: 300, // Twice the height of ArticleCard, again to give it space
                  marginBottom: 20,
                  alignContent: "center",
                }}
              />
            </View>
          ) : (
            // If newsData hasn't loaded, render the loading text
            <Text style={styles.loadingText}>Loading Articles</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mirrorWeatherContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  Header: {
    flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContainer: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  rowView: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tempText: {
    fontSize: 24,
    padding: 5,
    color: "#fff",
    textAlign: "center",
    flexDirection: "row",
  },
  timeText: {
    fontSize: 48,
    color: "#fff",
  },
  Body: {
    flex: 0.25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 10,
  },
  title: {
    fontSize: 38,
    color: "#fff",
    textAlign: "center",
  },
  subtext: {
    fontSize: 24,
    color: "#fff",
    padding: 5,
    margin: 10,
  },
  loadingText: {
    fontSize: 48,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  cityText: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    flexDirection: "row",
  },
  iconGlow: {
    textShadowColor: "lightgrey",
    textShadowRadius: 50,
  },
});
