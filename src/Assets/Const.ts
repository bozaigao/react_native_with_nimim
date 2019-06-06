import { Platform } from 'react-native';
const Dimensions = require('Dimensions');

export const screenW = Dimensions.get('window').width;
export const screenH = Dimensions.get('window').height;
export const isIphoneX =
  Platform.OS === 'ios' &&
    //iphoneX、iphoneXS
    (screenH === 812 && screenW === 375||
    //iphoneXR、iphoneXS Max
    screenH === 896 && screenW === 414);
export const ImageUriArr = [];
