import { Role } from "@app/role/index.entity";
import UserRole from "@core/constants/user-role";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export default class CreateRole implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const descriptionMap = {
      0: "admin-role-description",
      1: "moderator-role-description",
      2: "agent-role-description",
    };
    const roles = Object.keys(UserRole).map((key) => ({
      num: UserRole[key],
      label: key,
      description: descriptionMap[UserRole[key]],
    }));
    await connection
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(roles)
      .execute();
  }
}
