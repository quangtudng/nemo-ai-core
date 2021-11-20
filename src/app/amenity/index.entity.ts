import { BaseTimeStampEntity } from "@core/utils/crud/base-entity";
import slugify from "slugify";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("amenity")
export class Amenity extends BaseTimeStampEntity {
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
