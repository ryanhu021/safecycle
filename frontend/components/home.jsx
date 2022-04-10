import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Headline, withTheme, Button } from "react-native-paper";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
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
  // const [textFrom, setTextFrom] = React.useState("");
  // const [textTo, setTextTo] = React.useState("");

  const onSubmit = () => {
    navigation.navigate("Map");
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
        <View style={styles.input}>
          <GooglePlacesAutocomplete
            placeholder="From:"
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
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
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
            }}
            query={{
              key: "AIzaSyDfsDvdwRAW2caHnBK8o70vZX5y9POlFqU",
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
          Search Address
        </Button>
      </ImageBackground>
    </View>
  );
}
export default withTheme(homeComponent);
