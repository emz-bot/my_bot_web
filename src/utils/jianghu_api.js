import { get, post, uploadFile } from './http'

export const upload_avatar = data => uploadFile('/api/v1/jianghu/upload_avatar', data)