import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { randomBytes } from 'crypto'
import { Model } from 'mongoose'
import { CreateUrlDto } from './dto/create-url.dto'
import { UpdateUrlDto } from './dto/update-url.dto'
import { Url, UrlDocument } from './url.schema'

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async create(createUrlDto: CreateUrlDto, userId?: string): Promise<Url> {
    let slug = createUrlDto.slug ?? ''

    if (slug) {
      const exists = await this.urlModel.findOne({ slug })

      if (exists) throw new ConflictException('Slug already exists.')
    } else {
      let isUnique = false

      while (!isUnique) {
        slug = randomBytes(3).toString('hex')

        const exists = await this.urlModel.findOne({ slug })

        if (!exists) isUnique = true
      }
    }

    const url = new this.urlModel({
      originalUrl: createUrlDto.originalUrl,
      slug,
      user: userId || null,
    })

    return url.save()
  }

  async findBySlug(slug: string): Promise<Url> {
    const url = await this.urlModel.findOne({ slug })

    if (!url) throw new NotFoundException('URL not found.')

    return url
  }

  async incrementVisits(url: UrlDocument): Promise<void> {
    url.visits += 1

    await url.save()
  }

  async update(
    slug: string,
    updateUrlDto: UpdateUrlDto,
    userId: string
  ): Promise<Url> {
    const url = await this.urlModel.findOne({ slug })

    if (!url) throw new NotFoundException('URL not found.')

    const isOwner = url.user?.toString() === userId

    if (!isOwner) throw new BadRequestException('Unauthorized update attempt.')

    Object.assign(url, updateUrlDto)

    return url.save()
  }

  async findByUser(userId: string): Promise<Url[]> {
    return await this.urlModel.find({ user: userId })
  }
}
