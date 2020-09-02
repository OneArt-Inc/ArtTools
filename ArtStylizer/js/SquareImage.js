import React, { Component } from "react";
import { Image } from "react-native";

export default class SquareImage extends Component {
  getWidthHeightFitInArea = (
    originalWidth,
    originalHeight,
    areaWidth,
    areaHeight
  ) => {
    ratio = originalWidth / originalHeight;
    if (ratio > areaWidth / areaHeight) {
      // wider
      return {
        w: areaWidth,
        h: areaWidth / ratio,
      };
    } else {
      return {
        h: areaHeight,
        w: areaHeight * ratio,
      };
    }
  };

  constructor(props) {
    super(props);
    size = this.getWidthHeightFitInArea(
      props.width,
      props.height,
      props.containerWidth,
      props.containerHeight
    );
    this.state = {
      width: size.w,
      height: size.h,
    };
  }

  render() {
    return (
      <Image
        {...this.props}
        style={{ width: this.state.width, height: this.state.height }}
      />
    );
  }
}
