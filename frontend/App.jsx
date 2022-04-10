import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/home";
// eslint-disable-next-line import/no-named-as-default
import Map from "./components/map";

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    myOwnColor: "#BADA55",
  },
  textInput: {
    color: "white",
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <Stack.Navigator>
          <Stack.Screen
            name="SafeCycle"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Map" component={Map} />
        </Stack.Navigator>
      </PaperProvider>
      {/* <PaperProvider theme={theme}>
        <Map />
      </PaperProvider> */}
    </NavigationContainer>
  );
}
