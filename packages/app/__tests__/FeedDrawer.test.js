import React from "react";
import FeedDrawer from "../screens/feed/FeedDrawer";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import jest, { test, expect } from "jest";

// This section is used to mock the user data information within the FeedScreen.
// Without this, Jest does not recognize the user data and throws an error.
jest.mock("@app/utils/UserContext");

const mockedValue = {
  user: {
    isLoggedIn: true,
    data: {
      firstName: "Bob",
      lastName: "Larry",
      // some other data here ( just trying to at least make user.data be not undefined )
    },
  },
};

jest.mock("@app/utils/UserContext", () => ({
  ...jest.requireActual("@app/utils/UserContext"),
  useUserContext: () => mockedValue,
}));

// This section is the actual test of the FeedDrawer component

test("FeedDrawer is visible", () => {
  const { queryByText } = render(
    <NavigationContainer>{<FeedDrawer />}</NavigationContainer>
  );

  // Test if the drawer is able to be visible by default
  expect(queryByText("Home")).toBeTruthy();
});

// This section is used to mock the FlatList component within the FeedScreen. Without this, the render() function will throw an error.
jest.mock("react-native", () => {
  const React = jest.requireActual("react");
  const actual = jest.requireActual("react-native");
  const View = actual.View;
  const Text = actual.Text;
  function MockedFlatList() {
    return (
      <View>
        <Text>Mocked FlatList</Text>
      </View>
    );
  }
  Object.defineProperty(actual, "FlatList", {
    get: () => MockedFlatList,
  });
  return actual;
});
