import { get, post } from './http'

// BotManage

export const login = data => post('/api/login', data)
export const register = data => post('/api/register', data)
export const api_verification_code = data => get('/api/register', data)
