import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { HealthModule } from './health/health.module'
import { UrlModule } from './url/url.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 10 }]),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const isLocalEnv = process.env.NODE_ENV === 'local'

        if (isLocalEnv) {
          console.warn(`Using in-memory MongoDB for testing`)

          const mongod = await MongoMemoryServer.create()

          return { uri: mongod.getUri() }
        }

        return { uri: process.env.MONGODB_URI }
      },
    }),

    HealthModule,

    UrlModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
