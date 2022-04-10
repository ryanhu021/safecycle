import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Headline, withTheme, Button } from "react-native-paper";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import image from "../homeBackground.png";
// const image = {
//   uri: "https://thumbs.dreamstime.com/z/bandung-indonesia-city-map-black-white-color-bandung-indonesia-city-map-black-white-color-outline-map-vector-159720703.jpg",
// };

// eslint-disable-next-line no-undef

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
  },
  headerBox: {
    color: "#46494B",
    fontSize: 30,
    fontWeight: "bold",
    paddingBottom: 30,
    marginLeft: "30%",
  },
  container: {
    backgroundColor: "#9AD0F0",
    alignItems: "flex-start",
    justifyContent: "center",
    flex: 1,
  },
  input: {
    minHeight: "20%",
    minWidth: "90%",
    marginLeft: "5%",
    marginTop: "2%",
    maxWidth: "90%",
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "#46494B",
    borderColor: "#46494B",
    borderWidth: 1,
    borderRadius: 10,
    maxWidth: "95%",
    marginLeft: "5%",
  },
});

// function onPress() {
//   // eslint-disable-next-line no-alert
//   // eslint-disable-next-line no-undef
//   alert("hello!");
// }

function homeComponent({ navigation }) {
  const [textFrom, setTextFrom] = React.useState("From:");
  const [currCoords, setCurrCoords] = React.useState({
    latitude: 0,
    longitude: 0,
  });
  const [fromCoords, setFromCoords] = useState({ latitude: 0, longitude: 0 });
  const [toCoords, setToCoords] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setCurrCoords(loc.coords);
    })();
  }, []);

  const onSubmit = () => {
    // eslint-disable-next-line no-undef
    fetch("http://10.40.7.111:3001/path/safest", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat1: fromCoords.latitude,
        long1: fromCoords.longitude,
        lat2: toCoords.latitude,
        long2: toCoords.longitude,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const coords = [];
        for (let i = 0; i < data.length; i += 2) {
          coords.push({ latitude: data[i], longitude: data[i + 1] });
        }
        navigation.navigate("Map", { coordinates: coords });
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={image}
        minWidth="100%"
        resizeMode="cover"
        style={styles.image}
      >
        <Headline style={styles.headerBox}>SafeCycle</Headline>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => {
            setTextFrom(`${currCoords.latitude}, ${currCoords.longitude}`);
            setFromCoords(currCoords);
          }}
        >
          Current Location
        </Button>
        <View style={styles.input}>
          <GooglePlacesAutocomplete
            placeholder={textFrom}
            fetchDetails
            onPress={(data, details = null) => {
              setFromCoords({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              });
            }}
            query={{
              key: "",
              language: "en",
            }}
            keyboardShouldPersistTaps="never"
            enablePoweredByContainer={false}
          />
        </View>
        <View style={styles.input} marginBottom="50%">
          <GooglePlacesAutocomplete
            placeholder="To:"
            fetchDetails
            onPress={(data, details = null) => {
              setToCoords({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              });
            }}
            query={{
              key: "",
              language: "en",
            }}
            keyboardShouldPersistTaps="never"
            enablePoweredByContainer={false}
          />
        </View>
        <Button
          onPress={() => {
            // eslint-disable-next-line no-alert
            // eslint-disable-next-line no-undef
            onSubmit();
          }}
          mode="contained"
          style={styles.button}
        >
          Find Route
        </Button>
      </ImageBackground>
    </View>
  );
}
export default withTheme(homeComponent);
