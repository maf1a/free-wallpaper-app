import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { Text } from 'react-native';

import MainScreen from "./components/main.js";
import PictureScreen from "./components/picture.js";

const RootStack = StackNavigator({
  Home: { screen: MainScreen },
  Picture: { screen: PictureScreen },
  // initialRouteName: "Home"
});

export default class App extends Component {
  render() {
    return(
      <RootStack />
    );
  }
}
