import { EntityRepository } from "typeorm";
import { BaseCrudRepository } from "@core/utils/crud/base-repo";
import { User } from "./index.entity";
import { BadRequestException } from "@nestjs/common";
import { FilterUserDTO } from "./dto/filter-many";
import { HTTP_MESSAGE } from "@core/constants/error-message";

@EntityRepository(User)
export class UserRepository extends BaseCrudRepository<User> {
  async checkDuplicateEmail(email: string) {
    const isUserExists = await this.findOne({
      where: {
        email: email,
      },
    });
    if (isUserExists) {
      throw new BadRequestException(HTTP_MESSAGE.DUPLICATED);
    }
  }

  async findMany(param: FilterUserDTO): Promise<[User[], number]> {
    const limit = param.limit || 5;
    const offset = param.page && param.page > 1 ? (param.page - 1) * limit : 0;
    return this.createQueryBuilder("user")
      .where("user.email like :email", { email: `%${param.email}%` })
      .andWhere("user.firstname like :firstname", {
        firstname: `%${param.firstname}%`,
      })
      .andWhere("user.lastname like :lastname", {
        lastname: `%${param.lastname}%`,
      })
      .take(limit)
      .skip(offset)
      .getManyAndCount();
  }
}
