import { ReactNode } from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";

type PageViewProps = {
  children: ReactNode;
};

export const PageView = (props: PageViewProps) => {
  const { children } = props;

  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS !== "ios" ? StatusBar.currentHeight : 0,
  },
});
