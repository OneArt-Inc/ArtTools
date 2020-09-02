import React, { Component } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  Button,
  SafeAreaView,
  FileReader,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import {
  base64ImageToTensor,
  tensorToImageUrl,
  resizeImage,
  toDataUri,
} from "./Util.js";

const BACKEND_TO_USE = "rn-webgl";
const STYLENET_URL =
  "https://cdn.jsdelivr.net/gh/reiinakano/arbitrary-image-stylization-tfjs@master/saved_model_style_js/model.json";
const TRANSFORMNET_URL =
  "https://cdn.jsdelivr.net/gh/reiinakano/arbitrary-image-stylization-tfjs@master/saved_model_transformer_separable_js/model.json";
class Result extends Component {
  styleNet = null;
  transformNet = null;

  async init() {
    await Promise.all([this.loadStyleModel(), this.loadTransformerModel()]);
  }

  async loadStyleModel() {
    if (this.styleNet == null) {
      this.styleNet = await tf.loadGraphModel(STYLENET_URL);
    }
  }

  async loadTransformerModel() {
    if (this.transformNet == null) {
      this.transformNet = await tf.loadGraphModel(TRANSFORMNET_URL);
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      image: null,
      isReady: false,
    };
  }

  predictStyleParameters = (style) => {
    return tf.tidy(() => {
      if (this.styleNet == null) {
        throw new Error("Stylenet not loaded");
      }
      return this.styleNet.predict(
        style.toFloat().div(tf.scalar(255)).expandDims()
      );
    });
  };

  produceStylized = (content, bottleneck) => {
    return tf.tidy(() => {
      if (this.transformNet == null) {
        throw new Error("Transformnet not loaded");
      }
      const input = content.toFloat().div(tf.scalar(255)).expandDims();
      const image = this.transformNet.predict([input, bottleneck]);
      return image.mul(255).squeeze();
    });
  };

  stylizeTensors = (content, style, strength) => {
    // return new Promise((resolve, reject) => {
    let styleRepresentation = this.predictStyleParameters(style);
    if (strength !== undefined) {
      styleRepresentation = styleRepresentation
        .mul(tf.scalar(strength))
        .add(
          this.predictStyleParameters(content).mul(tf.scalar(1.0 - strength))
        );
    }
    const stylized = this.produceStylized(content, styleRepresentation);
    tf.dispose([styleRepresentation]);
    return stylized;
    // });
  };

  stylize = async (contentImage, artImage) => {
    const contentTensor = await base64ImageToTensor(contentImage);
    const styleTensor = await base64ImageToTensor(artImage);
    const stylizedResult = this.stylizeTensors(contentTensor, styleTensor);
    const stylizedImage = await tensorToImageUrl(stylizedResult);
    tf.dispose([contentTensor, styleTensor, stylizedResult]);
    return stylizedImage;
  };

  async componentDidMount() {
    // Wait for tf to be ready.
    await tf.setBackend(BACKEND_TO_USE);
    await tf.ready();
    await this.init();
    resizedContent = await resizeImage(
      this.props.route.params.content.uri,
      200
    );
    resizedArt = await resizeImage(this.props.route.params.art.uri, 200);
    this.stylize(resizedContent.base64, resizedArt.base64).then((image) => {
      this.setState({ image: image });
    });
  }
  render() {
    let { image } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.image && (
          <View style={styles.centerImage}>
            <Image
              style={{
                flex: 1,
                alignSelf: "stretch",
                height: undefined,
                width: undefined,
              }}
              resizeMode="contain"
              source={{ uri: toDataUri(image) }}
            />
          </View>
        )}

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
