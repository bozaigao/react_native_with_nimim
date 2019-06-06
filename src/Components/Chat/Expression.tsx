/**
 * @filename Expression.tsx
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/11/20
 * @Description: 聊天emoji表情
 */
import React, {Component} from 'react';
import {ImageBackground, ScrollView, TouchableOpacity, View} from 'react-native';
import style, {
    bdColor,
    bgColor,
    bt,
    default as styles,
    h,
    ml,
    radiusA,
    scaleSize,
    w,
    width,
    wRatio
} from '../../Styles/Style';
import expressionArr from './EmogiUnicodeArr'


interface State {
    currentPage: number;
}

interface Props {
    onEmojiPress: any;
}

export default class Expression extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
        };
    }


    renderImage(uri, j) {
        console.log(uri.img);
        return (
            <TouchableOpacity key={j} style={[{width: width / 8}, style.ujc, style.uac, h(50)]}
                              onPress={() => {
                                  this.props.onEmojiPress(uri);
                              }}>
                <ImageBackground source={uri.img} style={{width: scaleSize(28), height: scaleSize(28)}}/>
            </TouchableOpacity>
        )
    }

    renderExpression(item, index) {
        return (
            <View key={index} style={[{width: width}, h(50), style.udr]}>
                {item.map((uri, j) => this.renderImage(uri, j))}
            </View>
        )
    }

    renderOnePage(pageArr, i) {
        return (
            <View key={i} style={[{width: width}, h(150)]}>
                {pageArr.map((item, index) => this.renderExpression(item, index))}
            </View>
        )
    }

    renderCicle(tab, i) {
        if (i === this.state.currentPage) {
            return (
                <View key={"circle" + i}
                      style={[w(10), h(10), radiusA(5), bgColor("rgb(139,139,139)"), ml(10)]}/>
            )
        }
        return (
            <View key={"circle" + i}
                  style={[w(8), h(8), radiusA(5), bgColor("rgb(216,216,216)"), ml(10)]}/>
        );
    }

    render() {
        //这里创建多个表情页面

        return (
            <View style={[h(190), wRatio(100), bt(1), bdColor('#e9eff4')]}>
                <View style={[h(150), wRatio(100)]}>
                    <ScrollView horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                pagingEnabled={true}
                                onMomentumScrollEnd={(e) => {
                                    let index = Math.round(Math.round(e.nativeEvent.contentOffset.x) / Math.round(width));

                                    this.setState({currentPage: index});

                                }}>
                        {expressionArr.map((pageArr, i) => this.renderOnePage(pageArr, i))}
                    </ScrollView>
                </View>

                <View style={[wRatio(100), h(40), styles.udr, styles.uac, styles.ujc]}>
                    {expressionArr.map((pageArr, i) => this.renderCicle(pageArr, i))}
                </View>
            </View>
        )
    }
}
