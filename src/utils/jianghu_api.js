import { get, post, uploadFile } from './http'

export const upload_avatar = data => uploadFile('/jianghu/v1/user/upload_avatar', data)

export const create_channel = data => post('/jianghu/v1/channel/create_channel', data)
export const get_channel_list = data => get('/jianghu/v1/channel/channel_list', {})
export const join_channel = data => post('/jianghu/v1/channel/join_channel', data)