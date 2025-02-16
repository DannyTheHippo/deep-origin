import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateUrlDto } from './dto/create-url.dto'
import { UpdateUrlDto } from './dto/update-url.dto'
import { UrlDocument } from './url.schema'
import { UrlService } from './url.service'

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('urls')
  async createUrl(@Body() createUrlDto: CreateUrlDto, @Req() req: Request) {
    const userId = req.user ? (req.user as any).userId : null
    const url = await this.urlService.create(createUrlDto, userId)

    return {
      data: {
        type: 'url',
        id: url.slug,

        attributes: {
          originalUrl: url.originalUrl,
          slug: url.slug,
          visits: url.visits,
        },
      },
    }
  }

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    try {
      const url = await this.urlService.findBySlug(slug)

      await this.urlService.incrementVisits(url as UrlDocument)

      return res.redirect(url.originalUrl)
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ errors: [{ detail: 'URL not found.' }] })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/urls')
  async getUserUrls(@Req() req: Request) {
    const userId = (req.user as any).userId
    const urls = await this.urlService.findByUser(userId)

    return {
      data: urls.map((url) => ({
        type: 'url',
        id: url.slug,

        attributes: {
          originalUrl: url.originalUrl,
          slug: url.slug,
          visits: url.visits,
        },
      })),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('urls/:slug')
  async updateUrl(
    @Param('slug') slug: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Req() req: Request
  ) {
    const userId = (req.user as any).userId
    const url = await this.urlService.update(slug, updateUrlDto, userId)

    return {
      data: {
        type: 'url',
        id: url.slug,

        attributes: {
          originalUrl: url.originalUrl,
          slug: url.slug,
          visits: url.visits,
        },
      },
    }
  }
}
