/**
 * @filename IconButton.tsx
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/7/27
 * @Description: 给Image加上点击事件
 */
import React, {PureComponent} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {bgColor, color, commonStyles, default as styles, fSize, h, pa, w} from '../Styles/Style';
import {CachedImage} from "react-native-cached-fast-image";

interface Props {
    parentStyle?: any;
    imageWidth: number;
    imageHeight: number;
    source: any;
    onPress: any;
    //增加的热区值
    increaseHotspotValue?: number;
    //按钮标题
    title?: string;
    //标题字号大小
    fontSize?: number;
    //矫正style，如果按钮背景为图片的话由于底部有多余淡色部分所以感觉文字没有居中
    rectifyStyle?: any;
    //字体颜色
    fontColor?: string;
    //字体自定义样式
    textStyle?:any;
}

interface State {}

export default class IconButton extends PureComponent<Props, State> {
    constructor(props) {
        super(props);
    }

    render() {
        let { parentStyle, source, onPress, imageWidth, imageHeight, increaseHotspotValue, title, fontSize, rectifyStyle, fontColor, textStyle } = this.props;

        if (title) {
            return (
                <TouchableOpacity onPress={onPress} style={[parentStyle, pa(increaseHotspotValue ? increaseHotspotValue : 0)]}>
                    <CachedImage source={source} style={[w(imageWidth), h(imageHeight), styles.uac, styles.ujc, rectifyStyle]} resizeMode={'stretch'}>
                        <Text style={[textStyle,fSize(fontSize), color(fontColor ? fontColor : commonStyles.whiteColor), bgColor(commonStyles.transparent)]}>
                            {title}
                        </Text>
                    </CachedImage>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity onPress={onPress} style={[parentStyle, pa(increaseHotspotValue ? increaseHotspotValue : 0)]}>
                <CachedImage source={source} style={[w(imageWidth), h(imageHeight), bgColor(commonStyles.transparent)]} resizeMode={'stretch'} />
            </TouchableOpacity>
        );
    }
}
