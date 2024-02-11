import React, { useState } from "react";
import { Button } from "react-native";
import PropTypes from "prop-types";

export default function RegisterButton({ registerState }) {
  const [isRegistered, setRegisterState] = useState(registerState);
  const argsIndex = isRegistered ? 1 : 0;

  const buttonArgs = {
    title: ["Going", "Cancel"],
    color: ["", "red"],
  };

  const handleOnRegister = () => {
    setRegisterState(!isRegistered);
    {
      isRegistered
        ? alert("Cancelled successfully!")
        : alert("Register button works!");
    }
  };

  return (
    <Button
      title={buttonArgs.title[argsIndex]}
      onPress={handleOnRegister}
      color={buttonArgs.color[argsIndex]}
    />
  );
}

RegisterButton.propTypes = {
  registerState: PropTypes.bool,
};
