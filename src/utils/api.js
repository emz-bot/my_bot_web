import { get, post } from './http'

// BotManage
export const get_bot_list = data => get('/api/get_bot_list', data)
export const get_group_list_for_master = data => get('/api/get_group_list_for_master', data)
export const manipulate_bot = data => post('/api/manipulate_bot', data)
export const set_access_group_num = data => post('/api/set_access_group_num', data)

// 支付相关
export const create_activation_code = data => post('/api/create_activation_code', data)
export const get_activation_code = data => get('/api/activation_code_list', data)

export const get_chat_log = data => get('/api/get_chat_log', data)

export const api_source = data => post('/api/source', data)
export const api_get_memes = data => get('/api/source/memes/all', data)
export const api_get_kfc = data => get('/api/source/kfc/all', data)
export const api_get_food = data => get('/api/source/food/all', data)
export const api_get_drink = data => get('/api/source/drink/all', data)

export const login = data => post('/api/login', data)
export const register = data => post('/api/register', data)
export const api_verification_code = data => get('/api/register', data)

export const get_black_list = data => get('/api/black_list', data)
export const post_black_list = data => post('/api/black_list', data)


export const get_river_lantern = data => get('/api/get_river_lantern', data)

export const api_j3_team = data => post('/api/j3_team', data)
export const api_get_lankeshan = data => get('/api/v1/jx3/lankeshan/', {})
export const api_get_role_online = data => post('/api/v1/jx3/role_online/', data)
export const api_set_lankeshan = data => post('/api/manage/lankeshan_config', data)

export const api_get_config = data => get('/api/config', data)
export const api_set_config = data => post('/api/config', data)
export const api_test_mail = data => post('/api/test_mail', data)

export const api_update_doc = data => post('/api/manage/update_doc', data)
export const api_get_doc = data => get('/api/get_doc', data)

export const api_get_group_list = data => get('/api/get_group_list', data)
export const api_renewal = data => post('/api/renewal', data)
export const api_pay = data => get('/api/pay', data)
export const api_exit_group = data => get('/api/exit_group', data)
export const api_cancel_order = data => get('/api/cancel_order', data)