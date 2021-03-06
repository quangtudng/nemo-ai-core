import { User } from "@app/user/index.entity";
import { BaseTimeStampEntity } from "@core/utils/crud/base-entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("roles")
export class Role extends BaseTimeStampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "smallint",
  })
  num: number;

  @Column({
    type: "varchar",
  })
  label: string;

  @Column({
    type: "text",
    nullable: true,
  })
  description: string;

  @OneToMany(() => User, (user) => user.role, { onDelete: "SET NULL" })
  users: User[];
}
