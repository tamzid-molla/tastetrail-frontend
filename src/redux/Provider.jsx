"use client";
import AuthProvider from "@/providers/AuthProvider";
import { store } from "@/redux/store/store";
import { Provider } from "react-redux";

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
};

export default ReduxProvider;
