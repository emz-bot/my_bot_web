import { get, post } from './http'

// BotManage

export const login = data => post('/api/v1/user/login', data)
export const register = data => post('/api/v1/user/register', data)
export const api_verification_code = data => get('/api/v1/user/register', data)
