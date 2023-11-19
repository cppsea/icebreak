import {
  ImageProps as DefaultImageProps,
  ImageSourcePropType,
  ImageURISource,
  ViewStyle,
  StyleProp,
} from "react-native";

export type EventCardProps = {
  style?: StyleProp<ViewStyle> | StyleProp<ViewStyle>[];
  banner: ImageSourcePropType;
  title: string;
  timeBegin: string;
  timeEnd: string;
  location: string;
  description: string;
};

export type EventCardRegistrationProps = {
  register: () => void;
};

export type EventTextProps = {
  timeBegin: string;
  timeEnd: string;
  title: string;
  location: string;
  description: string;
};

export type EventType = {
  eventId: string;
  guildId: string;
  title: string;
  description: string;
  start_date?: string;
  end_date?: string;
  location: string;
  thumbnail?: string;
};

export type FaceIconProps = {
  index: number;
  iconUrl: string;
};

export type ImageProps = DefaultImageProps & {
  source: ImageURISource;
};
