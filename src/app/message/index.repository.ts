import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { Message } from "./index.entity";

@EntityRepository(Message)
export class MessageRepository extends BaseCrudRepository<Message> {}
