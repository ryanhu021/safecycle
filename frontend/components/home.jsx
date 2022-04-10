import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Headline, withTheme, Button } from "react-native-paper";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// eslint-disable-next-line no-undef

const styles = StyleSheet.create({
  headerBox: {
    color: "black",
    paddingBottom: 20,
    marginLeft: "35%",
  },
  container: {
    backgroundColor: "white",
    alignItems: "flex-start",
    justifyContent: "center",
    flex: 1,
  },
  input: {
    minHeight: "15%",
    minWidth: "100%",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "green",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    minWidth: "100%",
  },
});

// function onSelectedFrom() {
//   // eslint-disable-next-line no-alert
//   // eslint-disable-next-line no-undef
//   alert("hello!");
// }

function homeComponent() {
  // const [textFrom, setTextFrom] = React.useState("");
  // const [textTo, setTextTo] = React.useState("");
  return (
    <View style={styles.container}>
      <Headline adjustsFontSizeToFit="true" style={styles.headerBox}>
        SafeCycle
      </Headline>
      <View style={styles.input}>
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
          keyboardShouldPersistTaps="never"
          enablePoweredByContainer={false}
        />
      </View>
      <View style={styles.input}>
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
      </View>
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
