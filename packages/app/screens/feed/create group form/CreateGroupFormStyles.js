import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 6,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        flex: 1,
    },
    scrollview_extra_margin:{
        margin: 100,
    },
    inner: {
        padding: 36,
        flex: 1,
        justifyContent: "space-around",
    },
    header: {
        padding: 10,
        fontSize: 20,
    },
    important: {
        color: "red",
        fontSize: 15,
    },
    btnContainer: {
        backgroundColor: "white",
        textAlign: "center",
        justifyContent: "center",
        marginTop: 6,
        borderWidth: 2,
        borderColor: "black",
    },
    imageSelectorBtnContainer: {
        backgroundColor: 'white',
        textAlign: "center",
        justifyContent: "center",
        marginTop: 6,
        borderWidth: 1,
        borderColor: "black",
        height: 50,
    },
    bannerDisplay: {
        width: 200,
        height: 100,
        borderWidth: 1,
        borderColor: "black",
    },
    iconDisplay: {
        width: 100,
        height: 100,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "black",
    },
    imageSelectorContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});