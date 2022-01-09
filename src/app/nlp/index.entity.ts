import { BaseTimeStampEntity } from "@core/utils/crud/base-entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("nlp_results")
export class Nlp extends BaseTimeStampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
  })
  body: string;

  @Column({
    type: "text",
  })
  result: string;
}
