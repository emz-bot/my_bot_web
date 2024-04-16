import { get, post, uploadFile } from './http'

export const upload_avatar = data => uploadFile('/jianghu/v1/user/upload_avatar', data)