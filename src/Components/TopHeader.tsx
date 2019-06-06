/**
 * @filename TopHeader.tsx
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/7/31
 * @Description: 每个页面通用的导航条
 */
import React, { PureComponent } from 'react';
import { Text, View, Platform } from 'react-native';
import { Navigation } from 'react-navigation';
import { bgColor, color, commonStyles, default as styles, fSize, h, ml, pr, width, pt, pl } from '../Styles/Style';
import IconButton from './IconButton';
import { isIphoneX } from '../Assets/Const';

interface Props {
    navigation?: Navigation;
    title: string;
    noIcon?: boolean;
    rightComponent?: any;
    //自定义返回时事件
    customGoBack?: any;
    //是否为透明的
    transparent?:boolean;
}

interface State {}

export default class TopHeader extends PureComponent<Props, State> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { navigation, title, noIcon, rightComponent, customGoBack, transparent } = this.props;
        //适配iOS10系统状态栏高度
        let top = Platform.OS === 'ios' && Platform.Version < 11 ? 20 : 0;

        return (
            <View
                style={[pt(transparent ? (isIphoneX ? top + 44 : top + 20) : top), bgColor(transparent ? commonStyles.transparent : commonStyles.whiteColor)]}
            >
                <View style={[{ width }, h(commonStyles.headHeight), styles.udr, bgColor(transparent ? commonStyles.transparent : commonStyles.whiteColor)]}>
                    <View style={[{ flex: 0.5 }, styles.udc, styles.ujc]}>
                        {noIcon ? null : (
                            <IconButton
                                source={transparent ? require('../img/ico_back_white.png') : require('../img/ico_back.png')}
                                imageWidth={10}
                                imageHeight={20}
                                parentStyle={[ml(10)]}
                                onPress={() => {
                                    if (customGoBack) {
                                        customGoBack();
                                    } else {
                                        navigation.goBack();
                                    }
                                }}
                            />
                        )}
                    </View>
                    <View style={[{ flex: 2 }, styles.udr, styles.uac, styles.ujc, pl(10)]}>
                        <Text style={[color(transparent ? commonStyles.whiteColor : commonStyles.textBlackColor), fSize(18)]}>{title}</Text>
                    </View>
                    <View style={[{ flex: 0.5 }, styles.udr, styles.uac, styles.ujc, styles.uje, pr(10)]}>{rightComponent}</View>
                </View>
            </View>
        );
    }
}
