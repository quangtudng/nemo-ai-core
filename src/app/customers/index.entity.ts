import { BaseTimeStampEntity } from "@core/utils/crud/base-entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("customers")
export class Customers extends BaseTimeStampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    type: "varchar",
  })
  email: string;

  @Column({
    length: 50,
    type: "varchar",
  })
  fullname: string;
}
