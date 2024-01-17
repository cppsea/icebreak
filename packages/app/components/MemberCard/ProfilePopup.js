import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import { ThreeDotsButton } from "./MemberFunctions";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ProfilePopup = (props) => {
  const popupRef = React.useRef();

  const handleOverlayPress = (event) => {
    if (event.target !== popupRef.current) {
      props.onClose();
    }
  };

  return (
    <Modal
      tranparent={true}
      visible={props.isVisible}
      onRequestClose={props.onClose}>
      <TouchableOpacity
        style={styles.overlay}
        onPress={handleOverlayPress}
        activeOpacity={1}>
        <View style={styles.popup} ref={popupRef}>
          <Image
            source={
              props.image
                ? { uri: props.image }
                : require("@app/assets/no-pfp-icon.png")
            }
            style={styles.profileImage}
          />
          <Text style={styles.text}>{props.name}</Text>
          <ThreeDotsButton isProfilePopup={true} />
          {/**<Button title="Close" onPress={onClose} style={styles.button}/>*/}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const obgc = "rgba(0, 0, 0, 0.5)";
const pgbc = "white";
const psc = "#000";

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: obgc,
    height: windowHeight,
    justifyContent: "center",
    position: "absolute",
    width: windowWidth,
  },
  popup: {
    alignItems: "center",
    backgroundColor: pgbc,
    borderRadius: 20,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 200,
    padding: 20,
    shadowColor: psc,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: "80%",
  },
  profileImage: {
    borderRadius: 40,
    height: 80,
    marginBottom: 10,
    width: 80,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

ProfilePopup.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default ProfilePopup;
