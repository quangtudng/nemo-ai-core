import { AuthModule } from "@app/auth/index.module";
import { CategoryModule } from "@app/category/index.module";
import { LocationModule } from "@app/location/index.module";
import { UserModule } from "@app/user/index.module";
import typeOrmConfig from "@config/typeorm";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    AuthModule,
    CategoryModule,
    LocationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
