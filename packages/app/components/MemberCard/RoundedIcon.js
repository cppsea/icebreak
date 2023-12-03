import React from "react";
import PropTypes from "prop-types";
import { Image, View } from "react-native";

const RoundedIcon = ({ image }) => {
    const roundedIconStyle = {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    };

const imageStyle = {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    borderRadius: 15,
};

return (
    <View style={roundedIconStyle}>
        <Image
        style={imageStyle}
        source={image ? { uri: image } : require("@app/assets/no-pfp-icon.png")}
        />
    </View>
)};

RoundedIcon.propTypes = {
    image: PropTypes.string,
};

export default RoundedIcon;