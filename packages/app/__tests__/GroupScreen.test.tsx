import React from "react";
import { render } from "@testing-library/react-native";
import GroupScreen from "@app/screens/group/GroupScreen";
import GroupHeader from "@app/components/GroupScreen/GroupHeader";
import { GroupHeaderProps } from "@app/types/Group";

jest.mock("@expo/vector-icons/Ionicons", () => ({
  Ionicons: () => null,
}));

jest.mock("@expo/vector-icons/FontAwesome5", () => ({
  FontAwesome5: () => null,
}));

let props: GroupHeaderProps;

describe("GroupScreen Tests", () => {
  describe(GroupScreen, () => {
    it("renders the GroupHeader component", () => {
      const { getByTestId } = render(<GroupScreen />);
      const groupHeader = getByTestId("groupHeader");
      expect(groupHeader).toBeTruthy();
    });

    it("renders the GroupTabs component", () => {
      const { getByTestId } = render(<GroupScreen />);
      const groupTabs = getByTestId("groupTabs");
      expect(groupTabs).toBeTruthy();
    });

    it("renders the selected tab", () => {
      const { getByTestId } = render(<GroupScreen />);
      const tab = getByTestId("tab");
      expect(tab).toBeTruthy();
    });
  });

  describe(GroupHeader, () => {
    it("renders group icon", () => {
      const { getByTestId } = render(<GroupHeader {...props} />);
      const groupIcon = getByTestId("groupIcon");
      expect(groupIcon).toBeTruthy();
    });

    it("renders club banner", () => {
      const { getByTestId } = render(<GroupHeader {...props} />);
      const clubBanner = getByTestId("clubBanner");
      expect(clubBanner).toBeTruthy();
    });

    it("renders group header info", () => {
      const { getByTestId } = render(<GroupHeader {...props} />);
      const groupHeaderInfo = getByTestId("groupHeaderInfo");
      expect(groupHeaderInfo).toBeTruthy();
    });

    it("renders group media icons", () => {
      const { getByTestId } = render(<GroupHeader {...props} />);
      const groupMediaIcon = getByTestId("groupMediaIcon");
      expect(groupMediaIcon).toBeTruthy();
    });
  });
});
