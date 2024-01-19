import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ProductModule } from './module/product/product.module';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { AuthMiddleware } from './module/auth/middleware/auth.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './module/auth/guard/role.guard';
import { Product } from './module/product/product.entity';
import { User } from './module/user/user.entity';

@Module({
  imports: [
    /** Load and parse .env files from the environments directory */
    ConfigModule.forRoot({
      envFilePath: '.env',
      // load: [mysqlDB],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      entities: [Product, User],
      synchronize: true,
    }),
    ProductModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
