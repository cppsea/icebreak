import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import PropTypes from "prop-types";

function Screen(props) {
  const { children, ...rest } = props;

  return (
    <SafeAreaView {...rest}>
      <StatusBar barStyle="dark-content" />
      {children}
    </SafeAreaView>
  );
}

Screen.propTypes = {
  children: PropTypes.node
};

export default Screen;
