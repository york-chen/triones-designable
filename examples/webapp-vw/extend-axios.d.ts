//扩展axios的声明

import {AxiosRequestConfig} from 'axios'
declare module 'axios'{
    interface AxiosRequestConfig{
        skipErrorHandler?:boolean //是否跳过统一的抛错处理
        skipDebouncd?:boolean //是否跳过防抖
    }
}