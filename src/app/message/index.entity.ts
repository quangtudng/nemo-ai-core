import { Customer } from "@app/customer/index.entity";
import { BaseTimeStampEntity } from "@core/utils/crud/base-entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { QUESTION_TYPE } from "./constants/conversation";

@Entity("messages")
export class Message extends BaseTimeStampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
  })
  body: string;

  @Column({
    type: "tinyint",
    default: QUESTION_TYPE.FREE_TEXT,
  })
  type: number;

  @Column({
    type: "varchar",
  })
  owner: string;

  @Column({
    type: "text",
    nullable: true,
  })
  interestResults: string;

  @ManyToOne(() => Customer, (customer) => customer.messages)
  customer: Customer;
}
