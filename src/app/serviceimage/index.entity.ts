import { Service } from "@app/service/index.entity";
import { BaseTimeStampEntity } from "@core/utils/crud/base-entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToOne(() => Service, (service) => service.serviceImages)
  service: Service;
}
