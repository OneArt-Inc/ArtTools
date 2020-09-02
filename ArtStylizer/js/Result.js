import React, { Component } from "react";
import { StyleSheet, Image,Text, View, Button, SafeAreaView, FileReader} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { WebView } from 'react-native-webview';

const index = require("./html/index.html");

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null
    }

  }

  componentDidMount(){
    //     model.initialize().then(() => {
    //   let options = { encoding: FileSystem.EncodingType.Base64 };
    //   FileSystem.readAsStringAsync(this.props.route.params.content, options)
    //     .then((content) => {
    //       FileSystem.readAsStringAsync(
    //         this.props.route.params.art,
    //         options
    //       ).then((art) => {
    //         model.stylize(content, art).then((imageData) => {
    //           console.log("came here")
    //           image = "data:image/jpg;base64," + imageData
    //           this.setState({image: image})
    //         });
    //       });
    //     })
    //     .catch((err) => {
    //       console.log("​getFile -> err", err);
    //       reject(err);
    //     });
    // });
  }
  render() {
    let { image } = this.state;
    return (
      <SafeAreaView style={styles.container}>
   
<WebView source={index} style={{flex:1}} />

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
