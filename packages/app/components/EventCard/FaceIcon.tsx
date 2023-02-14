import React from "react";
import { StyleSheet, Image, ImageSourcePropType } from "react-native";

export type FaceIconProps = {
  index: number;
  iconUrl: string
}


const FaceIcon: React.FC<FaceIconProps> = ({index, iconUrl}) => {
  
  return <Image source={{ uri: iconUrl }} key={index} 
    style={{
      height: 36,
      width: 36,
      borderRadius: 18,
      transform: [{translateX: 30 - index * 20}]
    }}/>
};


export default FaceIcon;

