import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import {
  Headline,
  withTheme,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import GHUtil from "graphhopper-js-api-client/src/GHUtil";
import image from "../homeBackground.png";
// const image = {
//   uri: "https://thumbs.dreamstime.com/z/bandung-indonesia-city-map-black-white-color-bandung-indonesia-city-map-black-white-color-outline-map-vector-159720703.jpg",
// };

const ghUtil = new GHUtil();

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
  loading: {
    marginLeft: "5%",
    marginBottom: "5%",
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

  const [clicked, setClicked] = useState(false);

  const onSubmit = () => {
    setClicked(true);
    // eslint-disable-next-line no-undef
    // fetch("https://safecycle-api.onrender.com/path/bike", {
    // eslint-disable-next-line no-undef
    fetch("https://safecycle-api.herokuapp.com/path/bike", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startLat: fromCoords.latitude,
        startLon: fromCoords.longitude,
        endLat: toCoords.latitude,
        endLon: toCoords.longitude,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // decode encoded line string (code from GraphHopperRouting.js)
        if (data.paths) {
          for (let i = 0; i < data.paths.length; i++) {
            const path = data.paths[i];
            // convert encoded polyline to geo json
            if (path.points_encoded) {
              const tmpArray = ghUtil.decodePath(path.points, true);
              path.points = {
                type: "LineString",
                coordinates: tmpArray,
              };

              const tmpSnappedArray = ghUtil.decodePath(
                path.snapped_waypoints,
                true
              );
              path.snapped_waypoints = {
                type: "LineString",
                coordinates: tmpSnappedArray,
              };
            }
            if (path.instructions) {
              for (let j = 0; j < path.instructions.length; j++) {
                // Add a LngLat to every instruction
                const { interval } = path.instructions[j];
                // The second parameter of slice is non inclusive, therefore we have to add +1
                path.instructions[j].points = path.points.coordinates.slice([
                  interval[0],
                  interval[1] + 1,
                ]);
              }
            }
          }
        }

        // create coordinates for polyline
        const coords = [];
        data.paths[0].points.coordinates.forEach((coord) => {
          coords.push({ latitude: coord[1], longitude: coord[0] });
        });
        setClicked(false);
        navigation.navigate("Map", { coordinates: coords });
      })
      .catch((err) => {
        setClicked(false);
        console.log(err);
      });
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
              key: "AIzaSyDfsDvdwRAW2caHnBK8o70vZX5y9POlFqU",
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
              key: "AIzaSyDfsDvdwRAW2caHnBK8o70vZX5y9POlFqU",
              language: "en",
            }}
            keyboardShouldPersistTaps="never"
            enablePoweredByContainer={false}
          />
        </View>
        {/* display ActivityIndicator if clicked is true */}
        {clicked ? (
          <ActivityIndicator style={styles.loading} size="large" />
        ) : (
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
        )}
      </ImageBackground>
    </View>
  );
}
export default withTheme(homeComponent);
