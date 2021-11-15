import { BaseTimeStampEntity } from "@core/utils/crud/base-entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("service_image")
export class ServiceImage extends BaseTimeStampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 500,
    type: "varchar",
  })
  url: string;

  @Column({
    length: 500,
    type: "varchar",
  })
  fallbackUrl: string;
}
