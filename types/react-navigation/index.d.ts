import * as React from "react";

export function createStackNavigator(routeConfigMap: any, stackConfig: any);

export function createTabNavigator(routeConfigMap: any, stackConfig: any);

export function createBottomTabNavigator(routeConfigs: any, bottomTabNavigatorConfig: any);

export class Navigation {
    actions: any;
    addListener: any;
    dangerouslyGetParent: any;
    dismiss: any;
    dispatch: any;
    getChildNavigation: any;
    getParam: any;
    getScreenProps: any;
    goBack: any;
    isFocused: any;
    navigate: any;
    pop: any;
    popToTop: any;
    push: any;
    replace: any;
    reset: any;
    router: any;
    setParams: any;
    state: any;
    fromNative:boolean;
}


export interface NavigationEventsState {}

export interface NavigationEventsProperties extends React.Props<NavigationEvents> {
    onWillFocus?:any;
    onDidFocus?:any;
    onWillBlur?:any;
    onDidBlur?:any;
}
export class NavigationEvents extends React.Component<NavigationEventsProperties, NavigationEventsState> {
}
