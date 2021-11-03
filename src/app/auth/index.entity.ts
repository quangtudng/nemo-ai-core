import { User } from "@app/user/index.entity";
import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("auth_identities")
export class AuthIdentity {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    length: 500,
    type: "varchar",
    nullable: true,
  })
  refreshToken: string;

  @ApiProperty()
  @Column({
    length: 500,
    type: "varchar",
    nullable: true,
  })
  emailVerificationToken: string;

  @ApiProperty()
  @Column({
    type: "datetime",
    nullable: true,
  })
  emailVerificationValidUntil: string;

  @ApiProperty()
  @Column({
    length: 500,
    type: "varchar",
    nullable: true,
  })
  passwordResetToken: string;

  @ApiProperty()
  @Column({
    type: "datetime",
    nullable: true,
  })
  passwordResetValidUntil: string;

  @ApiProperty()
  @OneToOne(() => User, (user) => user.auth)
  @JoinColumn({ name: "user_id" })
  user: User;
}
