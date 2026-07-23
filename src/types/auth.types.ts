export interface ILoginResponse {
  token: string
  accessToken: string
  refreshToken: string
  user: {
    needPasswordChange: boolean
    email: string
    name: string
    role: string
    image: string
    status: string
    isDeleted: boolean
    emailVerified: boolean
  }
}

export interface LoginActionResponse {
  success: boolean
  message: string
  redirectTo?: string
}

export interface ResendOTPResponse {
  success: boolean
  message?: string
}
