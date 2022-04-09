import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Home from "./components/home";

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
    <PaperProvider theme={theme}>
      <Home />
    </PaperProvider>
  );
}