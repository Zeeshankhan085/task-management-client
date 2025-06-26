import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
  DEFAULT_THEME,
  mergeMantineTheme,
} from "@mantine/core";

import { QueryClient, QueryClientProvider } from "react-query";

const brand: MantineColorsTuple = [
  "#efefff",
  "#dddcf8",
  "#b7b5e7",
  "#8f8dd8",
  "#6e6acb",
  "#5854c3",
  "#4c49c0",
  "#3e3baa",
  "#363399",
  "#2b2c88",
];
const themeOverride = createTheme({
  colors: { brand },
  primaryColor: "brand",
});
const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <MantineProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </MantineProvider>,
  // </React.StrictMode>,
);

// 635FC7
