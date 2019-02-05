export default (
    state = {
        itemGiphyDetail: {},
        isShowDialog: false
    },
    action
) => {
    switch (action.type) {
        case 'click_item':
            return {
                isShowDialog: true,
                itemGiphyDetail: action.payload
            }
        case 'dismiss_dialog':
            return {
                isShowDialog: false,
                itemGiphyDetail: {}
            }
        default:
            return state;
    }
}