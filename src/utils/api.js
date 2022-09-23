import { get, post } from './http'

// BotManage
export const get_bot_list = data => get('/api/get_bot_list', data)
export const manipulate_bot = data => post('/api/manipulate_bot', data)
export const set_access_group_num = data => post('/api/set_access_group_num', data)

export const get_chat_log = data => get('/api/get_chat_log', data)

export const api_source = data => post('/api/source', data)
export const api_get_memes = data => get('/api/source/memes/all', data)
export const api_get_kfc = data => get('/api/source/kfc/all', data)
export const api_get_food = data => get('/api/source/food/all', data)

export const login = data => post('/api/login', data)
export const register = data => post('/api/register', data)
export const api_verification_code = data => get('/api/register', data)

export const get_black_list = data => get('/api/black_list', data)
export const post_black_list = data => post('/api/black_list', data)


export const get_river_lantern = data => get('/api/get_river_lantern', data)

export const api_j3_team = data => post('/api/j3_team', data)