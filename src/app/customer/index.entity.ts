import { Message } from "@app/message/index.entity";
import { BaseTimeStampEntity } from "@core/utils/crud/base-entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("customers")
export class Customer extends BaseTimeStampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
    nullable: true,
  })
  longId: string;

  @Column({
    length: 100,
    type: "varchar",
    nullable: true,
  })
  email: string;

  @Column({
    length: 50,
    type: "varchar",
    nullable: true,
  })
  ip: string;

  @Column({
    length: 50,
    type: "varchar",
    nullable: true,
  })
  location: string;

  @Column({
    default: 0,
    type: "tinyint",
  })
  viewed: number;

  @Column({
    type: "tinyint",
    nullable: true,
  })
  currentStage: number;

  @OneToMany(() => Message, (message) => message.customer)
  messages: Message[];
}
