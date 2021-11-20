import { Role } from "@app/role/index.entity";
import { User } from "@app/user/index.entity";
import * as CoreUsers from "@app/user/data/users.json";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const result = [];
    const users = Object.values(CoreUsers);
    for (let i = 0; i < users.length; i++) {
      const userData = users[i];
      const user = new User();
      user.email = userData.email;
      user.fullname = userData.fullname;
      user.status = userData.status;
      const role = await connection
        .createQueryBuilder<Role>(Role, "roles")
        .where("roles.label = :label", { label: userData.role })
        .getOne();
      user.role = role;
      user.password = "nemoai1345";
      result.push(user);
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(result)
      .execute();
  }
}
