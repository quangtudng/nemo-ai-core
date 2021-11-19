import { Amenity } from "@app/amenity/index.entity";
import { Category } from "@app/category/index.entity";
import { Location } from "@app/location/index.entity";
import { ServiceImage } from "@app/serviceimage/index.entity";
import { BaseTimeStampEntity } from "@core/utils/crud/base-entity";
import slugify from "slugify";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("service")
export class Service extends BaseTimeStampEntity {
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

  @Column({
    length: 200,
    nullable: true,
    type: "varchar",
  })
  originUrl: string;

  @Column({
    length: 200,
    nullable: true,
    type: "varchar",
  })
  fullAddress: string;

  @Column({
    length: 200,
    nullable: true,
    type: "varchar",
  })
  phoneNumber: string;

  @Column({
    length: 200,
    nullable: true,
    type: "varchar",
  })
  thumbnail: string;

  @Column({
    nullable: true,
    type: "int",
  })
  price: number;

  @OneToMany(() => ServiceImage, (serviceImage) => serviceImage.service, {
    cascade: ["insert", "update"],
    onDelete: "CASCADE",
  })
  serviceImages: ServiceImage[];

  @ManyToOne(() => Location, (location) => location.services)
  location: Location;

  @ManyToOne(() => Category, (category) => category)
  category: Category;

  @ManyToMany(() => Amenity)
  @JoinTable({ name: "services_amenities_pivot" })
  amenities: Amenity[];

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
