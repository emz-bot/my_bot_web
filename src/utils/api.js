import { get, post } from './http'

// BotManage
export const get_bot_list = data => get('/api/get_bot_list', data)
export const manipulate_bot = data => post('/api/manipulate_bot', data)
export const set_access_group_num = data => post('/api/set_access_group_num', data)

export const get_chat_log = data => get('/api/get_chat_log', data)

export const login = data => post('/api/login', data)
export const register = data => post('/api/register', data)

export const get_black_list = data => get('/api/black_list', data)
export const post_black_list = data => post('/api/black_list', data)