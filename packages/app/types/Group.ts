import { ComponentType } from "react";
import { ViewStyle, StyleProp } from "react-native";

export type GroupHeaderProps = {
  testID: string;
};

export type GroupHeaderInfoProps = {
  testID: string;
  name: string;
  description: string;
  handler: string;
  location: string;
  members: number;
  orgTags?: string[];
  tags: string[];
  url: string;
};

export type GroupIconProps = {
  backgroundColor: string;
  icon: number;
  size: number;
  testID: string;
};

export type GroupMediaIconProps = {
  size: number;
  testID: string;
  githubUrl: string;
  discordUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
};

export type GroupTabsProps = {
  activeTab: Tab;
  selectTab: Function;
  style: StyleProp<ViewStyle> | StyleProp<ViewStyle>[];
  tabs: Tab[];
  testID: string;
};

export type GroupTagProps = {
  text: string;
};

export type Tab = {
  name: string;
  screen: ComponentType<any>;
};

export type AboutScreenProps = {
  testID: string;
};

export type EventScreenProps = {
  testID: string;
  style: StyleProp<ViewStyle> | StyleProp<ViewStyle>[];
};

export type LeaderboardScreenProps = {
  testID: string;
};

export type MembersScreenProps = {
  testID: string;
};

export type NewsletterScreenProps = {
  testID: string;
};
