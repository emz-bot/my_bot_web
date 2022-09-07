import { get, post } from './http'

// BotManage
export const get_bot_list = data => get('/api/get_bot_list', data)
export const manipulate_bot = data => post('/api/manipulate_bot', data)
export const set_access_group_num = data => post('/api/set_access_group_num', data)

export const get_chat_log = data => get('/api/get_chat_log', data)

export const api_meme = data => post('/api/meme', data)
export const api_get_meme = data => get('/api/meme', data)
export const api_kfc = data => post('/api/kfc', data)
export const api_get_kfc = data => get('/api/kfc', data)
export const api_food = data => post('/api/food', data)
export const api_get_food = data => get('/api/food', data)

export const login = data => post('/api/login', data)
export const register = data => post('/api/register', data)
export const api_verification_code = data => get('/api/register', data)

export const get_black_list = data => get('/api/black_list', data)
export const post_black_list = data => post('/api/black_list', data)


export const get_river_lantern = data => get('/api/get_river_lantern', data)

export const api_j3_team = data => post('/api/j3_team', data)