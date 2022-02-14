import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { User } from "./index.entity";
import { UserRepository } from "./index.repository";
import { CreateUserDto } from "./dto/create-one";
import { RoleRepository } from "@app/role/index.repository";
import { UpdateUserDTO } from "./dto/update-one";
import { hashString } from "@core/utils/hash/bcrypt";

@Injectable()
export class UserService extends BaseCrudService<User> {
  constructor(
    private repo: UserRepository,
    private roleRepository: RoleRepository,
  ) {
    super(repo);
  }

  async createOne(dto: CreateUserDto): Promise<User> {
    // Check if email is unique
    await this.repo.checkDuplicateEmail(dto.email);
    const role = await this.roleRepository.findOneOrFail(dto.roleId);
    // Hash password
    if (dto.password) {
      dto.password = await hashString(dto.password);
    }
    dto.role = role;
    return super.createOne(dto);
  }

  async updateOne(id: number, dto: UpdateUserDTO): Promise<User> {
    const role = await this.roleRepository.findOneOrFail(dto.roleId);
    // Hash password
    if (dto.password) {
      dto.password = await hashString(dto.password);
    }
    dto.role = role;
    return super.updateOne(id, dto);
  }
}
