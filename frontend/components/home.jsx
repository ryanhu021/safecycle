import React from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import { Headline, withTheme, Button } from "react-native-paper";

import Placesearch from "react-native-placesearch";

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
      <Placesearch
        apikey="" // required *
        SelectedAddress={(data) => console.log(data)} // required *
        onClose={() => Keyboard.dismiss()}
        // country ="country code" //optional
        // coordinate={true} //optional
        removeImg
      />
      <Placesearch
        apikey="" // required *
        SelectedAddress={(data) => console.log(data)} // required *
        onClose={() => Keyboard.dismiss()}
        // country ="country code" //optional
        // coordinate={true} //optional
        removeImg
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
