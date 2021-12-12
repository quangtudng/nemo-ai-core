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
        email,
      },
    });
    if (isUserExists) {
      throw new BadRequestException(HTTP_MESSAGE.DUPLICATED);
    }
  }

  async findMany(param: FilterUserDTO): Promise<[User[], number]> {
    const limit = param.limit || 5;
    const offset = param.page && param.page > 1 ? (param.page - 1) * limit : 0;
    let builder = this.createQueryBuilder("user").leftJoinAndSelect(
      "user.role",
      "role",
    );
    if (param.email) {
      builder = builder.where("user.email like :email", {
        email: `%${param.email}%`,
      });
    }
    if (param.roleId) {
      builder = builder.andWhere("user.role = :roleId", {
        roleId: param.roleId,
      });
    }
    return builder.take(limit).skip(offset).getManyAndCount();
  }
}
