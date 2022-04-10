import React from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import { Headline, withTheme, Button } from "react-native-paper";

import Placesearch from "react-native-placesearch";

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
  const [textTo, setTextTo] = React.useState("");
  return (
    <View style={styles.container}>
      <Headline adjustsFontSizeToFit="true" style={styles.headerBox}>
        SafeCycle
      </Headline>
      <View style={styles.input}>
        <Placesearch
          placeHolder="From:"
          apikey="" // required *
          SelectedAddress={(data) => console.log(data)} // required *
          onClose={() => Keyboard.dismiss()}
          // country ="country code" //optional
          // coordinate={true} //optional
          removeImg
          borderColor="black"
        />
      </View>
      <View style={styles.input}>
        <Placesearch
          placeHolder="To:"
          apikey="" // required *
          // SelectedAddress={(data) => console.log(data)} // required *
          SelectedAddress={textTo} // required *
          // eslint-disable-next-line no-shadow
          onChangeText={(textTo) => setTextTo(textTo)}
          onClose={() => Keyboard.dismiss()}
          // country ="country code" //optional
          // coordinate={true} //optional
          removeImg
          borderColor="black"
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
