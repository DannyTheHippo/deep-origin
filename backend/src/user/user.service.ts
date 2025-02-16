import { ConflictException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './user.schema'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({
      username: createUserDto.username,
    })

    if (existing) throw new ConflictException('Username already exists.')

    const user = new this.userModel({
      username: createUserDto.username,
      password: await bcrypt.hash(createUserDto.password, 10),
    })

    return user.save()
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.userModel.findOne({ username })
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username)
    const valid = await bcrypt.compare(password, user.password)

    return user && valid ? user : null
  }
}
