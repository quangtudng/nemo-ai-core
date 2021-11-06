import slugify from "slugify";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";

@Entity("locations")
@Tree("materialized-path")
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    type: "varchar",
  })
  name: string;

  @Column({
    length: 100,
    type: "varchar",
  })
  type: string;

  @Column({
    length: 100,
    type: "varchar",
  })
  slug: string;

  @TreeParent({ onDelete: "CASCADE" })
  parent: Location;

  @TreeChildren()
  children: Location[];

  @BeforeInsert()
  @BeforeUpdate()
  slugify() {
    this.slug = slugify(this.name, {
      replacement: "-",
      lower: true,
      trim: true,
    });
  }
}
