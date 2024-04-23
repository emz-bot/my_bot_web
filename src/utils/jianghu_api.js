import { get, post, uploadFile } from './http'

export const upload_avatar = data => uploadFile('/jianghu/v1/user/upload_avatar', data)
export const set_user_info = data => post('/jianghu/v1/user/set_user_info', data)

export const create_channel = data => post('/jianghu/v1/channel/create_channel', data)
export const get_channel_list = data => get('/jianghu/v1/channel/channel_list', {})
export const join_channel = data => post('/jianghu/v1/channel/join_channel', data)
export const leave_channel = data => post('/jianghu/v1/channel/leave_channel', data)

export const get_sys_msg = data => get('/jianghu/v1/channel/sys_msg', {})
export const read_sys_msg = data => post('/jianghu/v1/channel/read_sys_msg', data)

export const accept_channel_apply = data => post('/jianghu/v1/channel/accept_apply', data)
export const reject_channel_apply = data => post('/jianghu/v1/channel/reject_apply', data)