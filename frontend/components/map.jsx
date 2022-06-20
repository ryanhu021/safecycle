import { useEffect, useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { withTheme } from "react-native-paper";
import MapView, { Polyline, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

function mapComponent({ route }) {
  const { coordinates } = route.params;

  const styles = StyleSheet.create({
    map: {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    },
  });

  // useEffect(() => {
  //   // eslint-disable-next-line no-undef
  //   fetch("http://10.40.7.111:3001/path/safest", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       lat1: 35.297896,
  //       long1: -120.665505,
  //       lat2: 35.288657,
  //       long2: -120.651738,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const coords = [];
  //       for (let i = 0; i < data.length; i += 2) {
  //         coords.push({ latitude: data[i], longitude: data[i + 1] });
  //       }
  //       setCoordinates(coords);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  const [location, setLocation] = useState({
    coords: { latitude: 0, longitude: 0 },
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      console.log(loc);
      setLocation(loc);
    })();
  }, []);

  return (
    <View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: coordinates[0].latitude,
          longitude: coordinates[0].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Polyline
          coordinates={coordinates}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          // strokeColors={[
          //   "#7F0000",
          //   "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
          //   "#B24112",
          //   "#E5845C",
          //   "#238C23",
          //   "#7F0000",
          // ]}
          strokeWidth={6}
        />
        <Circle
          center={location.coords}
          radius={10}
          strokeWidth={10}
          strokeColor="#000"
          fillColor="#000"
        />
      </MapView>
    </View>
  );
}
export default withTheme(mapComponent);
