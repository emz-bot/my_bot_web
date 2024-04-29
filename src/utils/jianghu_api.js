import { get, post, uploadFile } from './http'

export const upload_avatar = data => uploadFile('/api/v1/user/upload_avatar', data)
export const set_user_info = data => post('/api/v1/user/set_user_info', data)

export const create_channel = data => post('/api/v1/channel/create_channel', data)
export const get_channel_list = data => get('/api/v1/channel/channel_list', {})
export const join_channel = data => post('/api/v1/channel/join_channel', data)
export const leave_channel = data => post('/api/v1/channel/leave_channel', data)
export const delete_channel = data => post('/api/v1/channel/delete_channel', data)
export const get_sys_msg = data => get('/api/v1/channel/sys_msg', {})
export const read_sys_msg = data => post('/api/v1/channel/read_sys_msg', data)
export const accept_channel_apply = data => post('/api/v1/channel/accept_apply', data)
export const reject_channel_apply = data => post('/api/v1/channel/reject_apply', data)

export const get_jianghu_user_info = data => get('/api/v1/jianghu/user/get_user_info', data)