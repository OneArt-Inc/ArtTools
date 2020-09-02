import React, { Component } from "react";
import { StyleSheet, Image,Text, View, Button, SafeAreaView, FileReader} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as tf from '@tensorflow/tfjs';
import  '@tensorflow/tfjs-react-native';
import {base64ImageToTensor, tensorToImageUrl, resizeImage, toDataUri} from './Util.js';
import * as ImageManipulator  from 'expo-image-manipulator';

const BACKEND_TO_USE = 'rn-webgl';

class Result extends Component {
styleCheckpointURL = 'https://cdn.jsdelivr.net/gh/reiinakano/arbitrary-image-stylization-tfjs@master/saved_model_style_js/model.json'
transformCheckpointURL = "https://cdn.jsdelivr.net/gh/reiinakano/arbitrary-image-stylization-tfjs@master/saved_model_transformer_separable_js/model.json"
styleNet = null
transformNet = null

dispose() {
    if (this.styleNet) {
      this.styleNet.dispose();
    }
    if (this.transformNet) {
      this.transformNet.dispose();
    }

    this.setState({isReady:false})
  }

  async initialize() {
    this.dispose();

    [this.styleNet, this.transformNet] = await Promise.all([
      tf.loadGraphModel(
           this.styleCheckpointURL ),
      tf.loadGraphModel(
          this.transformCheckpointURL),
    ]);

    this.setState({isReady:true})
  }

  constructor(props) {
    super(props);
    this.state = {
      image: null,
      isReady: false,
    }

  }

  predictStyleParameters =(style)=> {
    return tf.tidy(() => {
      if (this.styleNet == null) {
        throw new Error('Stylenet not loaded');
      }
      return this.styleNet.predict(
          style.toFloat().div(tf.scalar(255)).expandDims());
    }) 
  }

   produceStylized =(content,bottleneck)=> {
    return tf.tidy(() => {
      if (this.transformNet == null) {
        throw new Error('Transformnet not loaded');
      }
      const input = content.toFloat().div(tf.scalar(255)).expandDims();
      const image =
          this.transformNet.predict([input, bottleneck]);
      return image.mul(255).squeeze();
    });
  }

  stylizeTensors = (content,style,strength)=> {
    return new Promise((resolve, reject) => {
      let styleRepresentation = this.predictStyleParameters(style);
      if (strength !== undefined) {
        styleRepresentation = styleRepresentation.mul(tf.scalar(strength))
                                  .add(this.predictStyleParameters(content).mul(
                                      tf.scalar(1.0 - strength)));
      }
      const stylized = this.produceStylized(content, styleRepresentation);
      tf.dispose([styleRepresentation]);
    return stylized;
    });
  }

   stylize = async (contentImage, artImage)=>{
    const contentTensor = await base64ImageToTensor(contentImage);
    const styleTensor = await base64ImageToTensor(artImage);
    const stylizedResult = this.stylizeTensors(
      contentTensor, styleTensor);
    const stylizedImage = await tensorToImageUrl(stylizedResult);
    // tf.dispose([contentTensor, styleTensor, stylizedResult]);
    return stylizedImage;
  }


 async componentDidMount(){
    // Wait for tf to be ready.
    await tf.setBackend(BACKEND_TO_USE);
    await tf.ready();
    ImageManipulator.manipulateAsync(
 this.props.route.params.content.uri,
 [{ resize: { width: 200 } }], // resize to width of 300 and preserve aspect ratio 
 { compress: 0.7, format: 'jpeg' },
).then(resizedContent=>{
  ImageManipulator.manipulateAsync(
 this.props.route.params.art.uri,
 [{ resize: { width: 200 } }], // resize to width of 300 and preserve aspect ratio 
 { compress: 0.7, format: 'jpeg' },
).then(resizedArt=>{
        let options = { encoding: FileSystem.EncodingType.Base64 };  
      FileSystem.readAsStringAsync(resizedContent.uri, options)
        .then((content) => {
          FileSystem.readAsStringAsync(
            resizedArt.uri,
            options
          ).then((art) => {
            this.initialize().then(()=>{
this.stylize(content, art).then((image) => {
              this.setState({image: image})
            });
    })
            
          });
        })
        .catch((err) => {
          console.log("​getFile -> err", err);
          reject(err);
        });
})
})
    
  }
  render() {
    let { image } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {
          this.state.image &&(
            <View style={styles.centerImage}>
            <Image source={{uri: this.state.image}}/></View>)
        }

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
