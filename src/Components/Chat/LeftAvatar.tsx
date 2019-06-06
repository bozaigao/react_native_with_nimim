import React from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import {globalStyle} from '../../Styles/ChatStyle';
import {CachedImage} from "react-native-cached-fast-image";

export default (props) => {
    if (props.onPress) {
        return (
            <TouchableOpacity style={globalStyle.avatarWrapper} onPress={props.onPress}>
                <CachedImage source={{uri: props.uri}} style={globalStyle.avatar}/>
            </TouchableOpacity>
        );
    }
    return (
        <View style={globalStyle.avatarWrapper}>
            <CachedImage source={{uri: props.uri}} style={globalStyle.avatar}/>
        </View>
    );
};
