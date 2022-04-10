import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Headline, withTheme, Button } from "react-native-paper";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// eslint-disable-next-line no-undef
navigator.geolocation = require("react-native-geolocation-service");

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 45,
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  input: {
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "green",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
  },
});

function homeComponent(props) {
  //   const [textFrom, setTextFrom] = React.useState("");
  //   const [textTo, setTextTo] = React.useState("");
  const { colors } = props.theme;

  return (
    <View style={styles.container}>
      <Headline style={{ color: colors.myOwnColor }}>SafeCycle</Headline>
      <Text>From</Text>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: "",
          language: "en",
        }}
        currentLocation
        currentLocationLabel="Current location"
        keyboardShouldPersistTaps="never"
        enablePoweredByContainer={false}
      />
      <Text>To</Text>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: "",
          language: "en",
        }}
        keyboardShouldPersistTaps="never"
        enablePoweredByContainer={false}
      />
      <Button
        onPress={() => {
          // eslint-disable-next-line no-alert
          // eslint-disable-next-line no-undef
          alert("You tapped the button!");
        }}
        mode="contained"
        style={styles.button}
      >
        Find Route
      </Button>
    </View>
  );
}
export default withTheme(homeComponent);
