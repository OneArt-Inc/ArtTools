import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      containerSize: Math.round(Dimensions.get("window").width),
    };
  }

  getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({
          image: result.uri,
          width: result.width,
          height: result.height,
        });
      }
    } catch (E) {}
  };

  render() {
    let { image, width, height } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {image && (
          <View style={styles.centerImage}>
            <Image
              source={{ uri: image }}
              style={{
                flex: 1,
                alignSelf: "stretch",
                height: undefined,
                width: undefined,
              }}
              resizeMode="contain"
            />
          </View>
        )}
        <View style={styles.bottomButtons}>
          <Button title="Select" onPress={this.pickImage} />
          <Button
            title="Next"
            onPress={() => {
              if (this.state.image) {
                this.props.navigation.navigate("Art");
              } else {
                Alert.alert("Please select a content first.");
              }
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  return <Content {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
  centerImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
