import { ImageProps as DefaultImageProps, ImageSourcePropType, ImageURISource } from "react-native";

export type EventCardProps = {
  banner: ImageSourcePropType,
  title: string,
  timeBegin: string,
  timeEnd: string,
  location: string,
  description: string,
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
  event_id: string,
  guild_id: string,
  title: string,
  description: string,
  start_date: number,
  end_date: number,
  location: string,
  thumbnail: string
};

export type FaceIconProps = {
  index: number;
  iconUrl: string
}

export type ItemType = {
  banner: ImageSourcePropType,
  title: string,
  description: string,
  location: string,
  start_date: string,
  end_date: string
};

export type ImageProps = DefaultImageProps & {
  source: ImageURISource;
};