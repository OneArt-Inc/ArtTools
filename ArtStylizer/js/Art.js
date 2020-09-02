import React, { Component } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

class Art extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bottomButtons}>
          <Button title="Select" onPress={() => {}} />
          <Button
            title="Next"
            onPress={() => this.props.navigation.navigate("Result")}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  return <Art {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
});
