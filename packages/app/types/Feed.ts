import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Feed Drawer Navigation Props

export type FeedStackParamList = {
  Feed: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type FeedScreenNavigationProps = NativeStackScreenProps<
  FeedStackParamList,
  "Feed"
>;
export type ProfileScreenNavigationProps = NativeStackScreenProps<
  FeedStackParamList,
  "Profile"
>;
export type SettingsScreenNavigationProps = NativeStackScreenProps<
  FeedStackParamList,
  "Settings"
>;
