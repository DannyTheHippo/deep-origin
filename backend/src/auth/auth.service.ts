import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.validateUser(username, pass)

    if (!user) return null

    const { password, ...result } = (user as any).toObject()

    return result
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id }

    return {
      data: {
        type: 'auth',
        id: user.username,

        attributes: {
          access_token: this.jwtService.sign(payload),
        },
      },
    }
  }
}
