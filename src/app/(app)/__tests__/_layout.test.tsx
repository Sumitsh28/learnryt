import { render } from "@testing-library/react-native";
import React from "react";

import RootLayout from "../_layout";

jest.mock("../../../global.css", () => ({}), { virtual: true });

jest.mock("expo-router", () => {
  const React = require("react");

  const MockTabs = ({ children }: any) => <>{children}</>;

  MockTabs.Screen = ({ name }: any) => <>{name}</>;

  return {
    Tabs: MockTabs,
  };
});

jest.mock("lucide-react-native", () => {
  return new Proxy(
    {},
    {
      get: () => "Icon",
    },
  );
});

jest.mock("@/hooks/useNotifications", () => ({
  useNotifications: () => ({
    requestPermissions: jest.fn(),
  }),
}));

jest.mock("@react-native-community/netinfo", () => ({
  useNetInfo: () => ({
    isConnected: true,
    isInternetReachable: true,
  }),
}));

describe("RootLayout", () => {
  it("renders app tabs layout", () => {
    const { toJSON } = render(<RootLayout />);

    expect(toJSON()).toBeTruthy();
  });
});
