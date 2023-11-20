import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LandingScreen from "@app/screens/landing/LandingScreen";

// Need these to avoid "Cannot use import statement outside a module" error
jest.mock("expo-web-browser", () => ({
  maybeCompleteAuthSession: jest.fn(),
}));
jest.mock("expo-auth-session/providers/google", () => jest.fn());
jest.mock("@app/utils/datalayer", () => jest.fn());
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock("expo-constants", () => ({
  Constants: () => null,
}));

let props: any;
const mockedNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockedNavigate }),
}));

describe(LandingScreen, () => {
  it("renders logo text", () => {
    const { getByTestId } = render(<LandingScreen {...props} />);
    const logo = getByTestId("logo");
    expect(logo).toBeTruthy();
  });

  describe("Email/Password Text Inputs", () => {
    it("renders correctly", () => {
      const { getByTestId } = render(<LandingScreen {...props} />);
      const emailInput = getByTestId("emailInput.textInput");
      const passwordInput = getByTestId("passwordInput.textInput");
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });

    it("displays the placeholder text", () => {
      const { getByTestId } = render(<LandingScreen {...props} />);

      const emailInput = getByTestId("emailInput.textInput");
      const passwordInput = getByTestId("passwordInput.textInput");

      expect(emailInput.props.placeholder).toBeTruthy();
      expect(passwordInput.props.placeholder).toBeTruthy();
    });

    it("accepts inputs", () => {
      const { getByTestId } = render(<LandingScreen {...props} />);

      const emailInput = getByTestId("emailInput.textInput");
      const passwordInput = getByTestId("passwordInput.textInput");

      fireEvent.changeText(emailInput, "123");
      fireEvent.changeText(passwordInput, "123");

      expect(emailInput.props.value).toBe("123");
      expect(passwordInput.props.value).toBe("123");
    });

    it("doesn't accept an invalid email/password", () => {
      const { queryByTestId, getByTestId } = render(
        <LandingScreen {...props} />
      );
      const loginButton = getByTestId("loginButton");
      const emailInput = getByTestId("emailInput.textInput");
      const passwordInput = getByTestId("passwordInput.textInput");

      expect(queryByTestId("emailInput.errorText")).toBeFalsy();
      expect(queryByTestId("passwordInput.errorText")).toBeFalsy();
      fireEvent.changeText(emailInput, "invalid-email");
      fireEvent.changeText(passwordInput, "");
      fireEvent.press(loginButton);
      expect(queryByTestId("emailInput.errorText")).toBeTruthy();
      expect(queryByTestId("passwordInput.errorText")).toBeTruthy();
    });

    it("visibility icon toggles password visibility", () => {
      const { getByTestId } = render(<LandingScreen {...props} />);
      const hidePasswordButton = getByTestId("passwordInput.visibility");
      const passwordInput = getByTestId("passwordInput.textInput");

      expect(passwordInput.props.secureTextEntry).toBeTruthy();
      fireEvent.press(hidePasswordButton);
      expect(passwordInput.props.secureTextEntry).toBeFalsy();
    });
  });

  describe("Buttons", () => {
    it("login button renders correctly", () => {
      const { getByTestId } = render(<LandingScreen {...props} />);
      const loginButton = getByTestId("loginButton");
      expect(loginButton).toBeTruthy();
      fireEvent.press(loginButton);
    });

    it("google button renders correctly", () => {
      const { getByTestId } = render(<LandingScreen {...props} />);
      const googleButton = getByTestId("googleButton");
      expect(googleButton).toBeTruthy();
      fireEvent.press(googleButton);
    });

    it("signup button renders correctly", () => {
      const mockNavigation = {
        navigate: jest.fn(),
      };
      const { getByTestId } = render(
        <LandingScreen navigation={mockedNavigate} {...props} />
      );
      const signupButton = getByTestId("signupButton");
      expect(signupButton).toBeTruthy();
      fireEvent.press(signupButton);
    });

    it("forgot password button renders correctly", () => {
      const { getByTestId } = render(<LandingScreen {...props} />);
      const forgotPassButton = getByTestId("forgotPassButton");
      expect(forgotPassButton).toBeTruthy();
      fireEvent.press(forgotPassButton);
    });
  });
});
