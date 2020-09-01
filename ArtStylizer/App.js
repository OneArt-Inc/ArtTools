import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button, SafeAreaView} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
const FirstScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bottomButtons}>
        <Button title="Select" onPress={() => {}} />
        <Button title="Next" onPress={() => navigation.navigate("Art")} />
      </View>
    </SafeAreaView>
  );
};

const SecondScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bottomButtons}>
        <Button title="Select" onPress={() => {}} />
        <Button title="Next" onPress={() => navigation.navigate("Result")} />
      </View>
    </SafeAreaView>
  );
};

const ThirdScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bottomButtons}>
        <Button
          title="Reselect"
          onPress={() => {
            navigation.navigate("Content");
          }}
        />
        <Button title="Save" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
};
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Content" component={FirstScreen} />
        <Stack.Screen name="Art" component={SecondScreen} />
        <Stack.Screen name="Result" component={ThirdScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
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
