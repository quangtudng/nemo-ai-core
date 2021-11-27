import { Service } from "@app/service/index.entity";
import slugify from "slugify";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
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

  @Column({
    type: "text",
    nullable: true,
  })
  description: string;

  @OneToMany(() => Service, (service) => service.location)
  services: Service[];

  @TreeParent({ onDelete: "CASCADE" })
  parent: Location;

  @TreeChildren()
  children: Location[];

  @BeforeInsert()
  @BeforeUpdate()
  slugify() {
    this.slug = slugify(`${this.name} ${this.type}`, {
      replacement: "-",
      lower: true,
      trim: true,
    });
  }
}
