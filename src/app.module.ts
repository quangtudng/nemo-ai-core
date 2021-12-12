import { AmenityModule } from "@app/amenity/index.module";
import { AuthModule } from "@app/auth/index.module";
import { CategoryModule } from "@app/category/index.module";
import { CloudinaryModule } from "@app/cloudinary/index.module";
import { LocationModule } from "@app/location/index.module";
import { ServiceModule } from "@app/service/index.module";
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
    AmenityModule,
    ServiceModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
