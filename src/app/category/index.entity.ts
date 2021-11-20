import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import slugify from "slugify";
import { BaseTimeStampEntity } from "@core/utils/crud/base-entity";
import { Service } from "@app/service/index.entity";

@Entity("category")
export class Category extends BaseTimeStampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    type: "varchar",
  })
  title: string;

  @Column({
    type: "text",
    nullable: true,
  })
  description: string;

  @Column({
    length: 200,
    type: "varchar",
  })
  slug: string;

  @OneToMany(() => Service, (service) => service.category)
  services: Service[];

  @BeforeInsert()
  @BeforeUpdate()
  slugify() {
    this.slug = slugify(this.title, {
      replacement: "-",
      lower: true,
      trim: true,
    });
  }
}
