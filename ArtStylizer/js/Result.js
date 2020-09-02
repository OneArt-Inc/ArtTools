import React, { Component } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

class Result extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.bottomButtons}>
          <Button
            title="Reselect"
            onPress={() => {
              this.props.navigation.navigate("Content");
            }}
          />
          <Button title="Save" onPress={() => {}} />
        </View>
      </SafeAreaView>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  return <Result {...props} navigation={navigation} />;
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
