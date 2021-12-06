import "../styles";
import React from "react";
import ReactDOM from "react-dom";
import { Popup } from "./Popup";
import { ChakraProvider } from '@chakra-ui/react';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Popup />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
