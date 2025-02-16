import { IsOptional, IsString, IsUrl, Matches } from 'class-validator'

export class CreateUrlDto {
  @IsUrl({}, { message: 'Invalid URL provided.' })
  originalUrl: string

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Slug must be alphanumeric.' })
  slug?: string
}
