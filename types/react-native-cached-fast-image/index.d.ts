import * as React from 'react';

export interface CachedImageProperties {
    source: any;
    style?: any;
    onPress?: any;
    ossImgName?: string;
    resizeMode?: string;

}

export interface CachedImageProperties extends CachedImageProperties {
}

export class CachedImage extends React.Component<CachedImageProperties, {}> {
}
