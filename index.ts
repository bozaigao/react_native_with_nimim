/**
 * @filename index.ts
 * @author 何晏波
 * @QQ 1054539528
 * @date 2019/1/30
 * @Description: 项目入口根目录文件
*/

import {AppRegistry} from 'react-native';
import App from './App';
declare let global:any;


//网易云信全局变量
global.nim = null;
global.sound = null;
AppRegistry.registerComponent('react_native_with_nimim', () => App);
