import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { User } from "./index.entity";
import { UserRepository } from "./index.repository";
import { CreateUserDto } from "./dto/create-one";
import { RoleRepository } from "@app/role/index.repository";
import { UpdateUserDTO } from "./dto/update-one";

@Injectable()
export class UserService extends BaseCrudService<User> {
  constructor(
    private repo: UserRepository,
    private roleRepository: RoleRepository,
  ) {
    super(repo);
  }

  async createOne(dto: CreateUserDto): Promise<User> {
    await this.repo.checkDuplicateEmail(dto.email);
    const role = await this.roleRepository.findOne(dto.roleId);
    dto.role = role;
    return super.createOne(dto);
  }

  async updateOne(id: number, dto: UpdateUserDTO): Promise<User> {
    await this.repo.checkDuplicateEmail(dto.email);
    const role = await this.roleRepository.findOne(dto.roleId);
    dto.role = role;
    return super.updateOne(id, dto);
  }
}
