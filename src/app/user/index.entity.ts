import { AuthIdentity } from "@app/auth/index.entity";
import { Role } from "@app/role/index.entity";
import UserStatus from "@core/constants/user-status";
import { BaseTimeStampEntity } from "@core/utils/crud/base-entity";
import { hashString } from "@core/utils/hash/bcrypt";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("users")
export class User extends BaseTimeStampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 100,
    type: "varchar",
  })
  email: string;

  @Column({
    length: 100,
    type: "varchar",
  })
  password: string;

  @Column({
    length: 50,
    type: "varchar",
    nullable: true,
  })
  fullname: string;

  @Column({
    length: 50,
    type: "varchar",
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    default: UserStatus.DISABLED,
    type: "tinyint",
  })
  status: number;

  @Column({
    type: "text",
    nullable: true,
  })
  bio: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToOne(() => AuthIdentity, (info) => info.user, { onDelete: "CASCADE" })
  auth: AuthIdentity;

  @BeforeInsert()
  @BeforeUpdate()
  async hashUserPassword() {
    this.password = await hashString(this.password);
  }
}
