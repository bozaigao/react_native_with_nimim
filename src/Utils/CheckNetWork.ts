import {NativeModules} from "react-native";
import {Toast} from "teaset";

export function checkNetworkAvailable(hasNetCallback,noNetCallback?:any) {
    NativeModules.NetworkUtil.checkNetworkAvailable(isNetworkAvailable => {
        if (isNetworkAvailable) {
            hasNetCallback();
        } else {
            noNetCallback();
            Toast.message('请检查网络');
        }
    });
}
