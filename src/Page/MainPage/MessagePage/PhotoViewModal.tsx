/**
 * @filename PhotoViewModal.tsxx.tsx
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/11/5
 * @Description: 点击聊天后跳转的界面
 */
import React, {PureComponent} from 'react';
import {Modal} from 'react-native';
//@ts-ignore
import ImageViewer from 'react-native-image-zoom-viewer';

interface Props {
    showModal: boolean;
    onPress: any;
    url?: string;
    urlList?: { url:string }[];
    saveFlag?: boolean;
}

interface State {}

export default class PhotoViewModal extends PureComponent<Props, State> {
    private viewRef;

    constructor(props) {
        super(props);
    }

    render() {
        let { showModal, onPress, url, urlList, saveFlag } = this.props;

        return (
            <Modal animationType="fade" transparent={true} visible={showModal} onRequestClose={() => {}}>
                <ImageViewer
                    imageUrls={urlList ? urlList : [{ url }]}
                    onClick={() => {
                        onPress();
                    }}
                    renderIndicator={() => null}
                    saveToLocalByLongPress={saveFlag ? saveFlag : false}
                />
            </Modal>
        );
    }
}
