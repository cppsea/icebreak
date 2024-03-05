import React, { useState } from "react";

import Button from "@app/components/Button";
import Screen from "@app/components/Screen";
import PropTypes from "prop-types";

function ResetPasswordScreen({ navigation, route }) {
  const [inputs] = useState({
    email: route.params?.email ?? "",
  });

  return (
    <Screen>
      <Button
        testId="home"
        title="forgot"
        onPress={() => {
          navigation.navigate("ForgotPasswordScreen", { email: inputs.email });
        }}
      />
    </Screen>
  );
}

ResetPasswordScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ResetPasswordScreen;
