import { Customer } from "@app/customer/index.entity";
import { BaseTimeStampEntity } from "@core/utils/crud/base-entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
