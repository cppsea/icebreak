import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Landing Stack Navigation Props

export type LandingStackParamList = {
  LandingScreen: { email: string };
  SignUpScreen: { email: string };
  ForgotPasswordScreen: { email: string };
};

export type LandingScreenNavigationProps = NativeStackScreenProps<
  LandingStackParamList,
  "LandingScreen"
>;
export type SignUpScreenNavigationProps = NativeStackScreenProps<
  LandingStackParamList,
  "SignUpScreen"
>;
export type ForgotPasswordScreenNavigationProps = NativeStackScreenProps<
  LandingStackParamList,
  "ForgotPasswordScreen"
>;
