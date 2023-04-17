import { FaceIconProps } from "@app/types/EventCard";
import React from "react";
import { Image } from "react-native";


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

