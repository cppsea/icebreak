import React from "react";
import { ScreenProps } from "@app/types/Screen";
import { SafeAreaView, StatusBar } from "react-native";
import PropTypes from "prop-types";
function Screen(props: ScreenProps) {
  const { children, ...rest } = props;

  return (
    <SafeAreaView {...rest}>
      <StatusBar barStyle="dark-content" />
      {children}
    </SafeAreaView>
  );
}

Screen.propTypes = {
  children: PropTypes.node,
};

export default Screen;
