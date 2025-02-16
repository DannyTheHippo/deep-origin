import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from '../user/user.schema'

export type UrlDocument = Url & Document

@Schema({ timestamps: true })
export class Url {
  @Prop({ required: true, unique: true })
  slug: string

  @Prop({ required: true })
  originalUrl: string

  @Prop({ default: 0 })
  visits: number

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  user: User
}

export const UrlSchema = SchemaFactory.createForClass(Url)
