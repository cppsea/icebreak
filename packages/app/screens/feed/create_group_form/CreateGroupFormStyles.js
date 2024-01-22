import { StyleSheet } from "react-native";

export const colors = {
  red: "red",
  white: "white",
  black: "black",
};

export const styles = StyleSheet.create({
  bannerDisplay: {
    borderColor: colors.black,
    borderWidth: 1,
    height: 100,
    width: 200,
  },
  btnContainer: {
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 2,
    justifyContent: "center",
    marginTop: 6,
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    padding: 10,
  },
  iconDisplay: {
    borderColor: colors.black,
    borderRadius: 100,
    borderWidth: 1,
    height: 100,
    width: 100,
  },
  imageSelectorBtnContainer: {
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    marginTop: 6,
    textAlign: "center",
  },
  imageSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  important: {
    color: colors.red,
    fontSize: 15,
  },
  inner: {
    flex: 1,
    justifyContent: "space-around",
    padding: 36,
  },
  input: {
    borderWidth: 1,
    height: 40,
    margin: 6,
    padding: 10,
  },
  scrollview_extra_margin: {
    margin: 100,
  },
});
