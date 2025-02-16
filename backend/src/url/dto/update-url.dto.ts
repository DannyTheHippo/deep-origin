import { IsOptional, IsString, Matches } from 'class-validator'

export class UpdateUrlDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Slug must be alphanumeric.' })
  slug?: string
}
