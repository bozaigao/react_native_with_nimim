import storage from '../Store/AsyncStore';

/**
 * @filename Storage.ts
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/8/13
 * @Description: 本地缓存处理
 */
export async function get(key: string, callback) {
    await storage
        .load({key})
        .then(async data => {
            await callback(data);
        })
        .catch(async err => {
            // any exception including data not found
            // goes to catch()
            console.warn(err.message);
            switch (err.name) {
                case 'NotFoundError':
                    // TODO;
                    break;
                case 'ExpiredError':
                    // TODO
                    break;
                default:
                    break;
            }
            await callback(null);
        });
}

export function save(key, data) {
    storage.save({key, data});
}

export function clear(key) {
    storage.save({key, data: null});
}


/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/26
 * @function: 判断应用是否登录
*/
export function judgeLogin(loginedCallback, noLoginCallback) {
    get('loginToken', str => {
        if (str) {
            loginedCallback();
        } else {
            noLoginCallback();
        }
    });
}
