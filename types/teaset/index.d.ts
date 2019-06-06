export namespace ModalIndicator {
    declare function show(notice: string);

    declare function hide();
}
export namespace Toast {
    declare function message(notice: string);
    declare function success(notice: string);
    declare function fail(notice: string);
}

export namespace Drawer{
    declare function open(view: any,side:string,rootTransform:string,options:any);
}

export class NavigationPage {
    static defaultProps: {
        horizontal: true,
        pagingEnabled: true,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
        bounces: false,
        scrollsToTop: false,
        removeClippedSubviews: true,
        automaticallyAdjustContentInsets: false,
        showsPagination: true,
        showsButtons: false,
        disableNextButton: false,
        loop: true,
        loadMinimal: false,
        loadMinimalSize: 1,
        autoplay: false,
        autoplayTimeout: 2.5,
        autoplayDirection: true,
        index: 0,
        onIndexChanged: () => null
    }
}

export class Overlay {
    static View:any;
    static show:(overlayView:any)=>void;
}
