import { get, post } from './http'

// BotManage
export const get_bot_list = data => get('/get_bot_list', data)
export const manipulate_bot = data => post('/manipulate_bot', data)
export const set_access_group_num = data => post('/set_access_group_num', data)

export const get_chat_log = data => get('/get_chat_log', data)

export const login = data => post('/login', data)
export const register = data => post('/register', data)