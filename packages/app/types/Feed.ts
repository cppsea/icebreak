import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReactNode } from "react";
import {
  ColorValue,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

// Feed Drawer Navigation Props

export type FeedStackParamList = {
  Feed: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type FeedScreenNavigationProps = NativeStackScreenProps<FeedStackParamList, 'Feed'>;
export type ProfileScreenNavigationProps = NativeStackScreenProps<FeedStackParamList, 'Profile'>;
export type SettingsScreenNavigationProps = NativeStackScreenProps<FeedStackParamList, 'Settings'>;
