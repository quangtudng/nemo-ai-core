import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import slugify from "slugify";

@Entity("category")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    type: "varchar",
  })
  title: string;

  @Column({
    type: "text",
  })
  description: string;

  @Column({
    length: 200,
    type: "varchar",
  })
  slug: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashUserPassword() {
    this.slug = slugify(this.title, {
      replacement: "-",
      lower: true,
      trim: true,
    });
  }
}
