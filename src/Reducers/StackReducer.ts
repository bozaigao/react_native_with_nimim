import {RootNavigator} from "../Scence/index";
import {Platform} from "react-native";

const initialState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams('MessagePage'));

export default function nav(state = initialState, action) {

    //@ts-ignore
    const nextState = RootNavigator.router.getStateForAction(action, state);

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
}
