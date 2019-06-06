/**
 * 中间件
 * @param client
 * @returns {function({dispatch?: *, getState?: *})}
 */
export default function clientMiddleware(client) {
    return ({ dispatch, getState }) => {
        return next => action => {
            if (typeof action === 'function') {
                return action(dispatch, getState);
            }
            const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare

            if (!promise) {
                return next(action);
            }
            const [SUCCESS] = types,
                actionPromise = promise(client);

            actionPromise
                .then(
                    res => {
                        switch (res.data.status) {
                        case 0:
                        case 40005:
                            return next({
                                ...rest,
                                'res': res.data.info,
                                'result': res.data,
                                'hashData': res.data.hashData,
                                'type': SUCCESS
                            });
                        case -1:
                            return next({
                                ...rest,
                                'res': { 'status': -1, 'msg': '网络故障，请稍后重试！' },
                                'type': 'error'
                            });
                        case 110:
                            return next({
                                ...rest,
                                'res': { 'status': -1, 'msg': '接口不存在' },
                                'type': 'error'
                            });
                        default:
                            return next({
                                ...rest,
                                'res': { 'status': res.data.status, 'msg': res.data.msg },
                                'type': 'error'
                            });
                        }
                    }
                    //调试期间 注释 catch  ， 否则 无法定位错误位置
                )
                .catch(error => {
                    console.log(error);
                    // return next({...rest, res: {status: -1, msg: error}, type: "error"});
                });
            return actionPromise;
        };
    };
}
