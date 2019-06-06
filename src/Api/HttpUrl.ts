//内网测试地址
let StagingUrl = '';
//线上发布地址
let ProductionUrl = '';
const BASE_URL = ``,
    ALI_OSS_URL = '',
    //网络请求返回状态码
    NetworkState = {
        //返回成功
        SUCCESS: 0,
        NO_FOUND: 404,
    };


export default {
    BASE_URL,
    ALI_OSS_URL,
    NetworkState,
};
