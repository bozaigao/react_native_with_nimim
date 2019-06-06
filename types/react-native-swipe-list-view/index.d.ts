import * as React from "react";

export interface SwipeListViewState {
}

export interface SwipeListViewProperties extends React.Props<SwipeListView> {
    useFlatList?: boolean;
    data?: any[];
    renderItem?: (data, rowMap)=>JSX.Element;
    renderHiddenItem?:(data, rowMap)=>JSX.Element;
    renderHiddenRow?:(data, secId, rowId, rowMap)=>JSX.Element;
    leftOpenValue?: number;
    rightOpenValue?: number;
    previewRowKey?:string;
    previewOpenValue?:number;
    previewOpenDelay?:number;
    onRowDidOpen?:any;
    useSectionList?:boolean;
    sections?:any;
    dataSource?:any;
    renderRow?:any;
    renderSectionHeader?:any;
    disableLeftSwipe?:any;
    disableRightSwipe?:any;
}

export class SwipeListView extends React.Component<SwipeListViewProperties, SwipeListViewState> {
}

export interface SwipeRowState {
}

export interface SwipeRowProperties extends React.Props<SwipeRow> {
    leftOpenValue?:number;
    rightOpenValue?:number;
    disableLeftSwipe?:boolean;
}

export class SwipeRow extends React.Component<SwipeRowProperties, SwipeRowState> {
}
