import { Role } from "@app/role/index.entity";
import UserRole from "@app/role/data/user-role";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export default class CreateRole implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const descriptionMap = {
      0: "Quản trị viên chính của hệ thống, đóng vai trò quản lý các tính năng quan trọng của hệ thống",
      1: "Kiểm duyệt viên chính của hệ thống, đóng vai trò quản lý và kiểm duyệt trong hệ thống.",
      2: "Đối tác bên thứ ba chính của hệ thống, là người trực tiếp theo dõi và làm việc với khách hàng du lịch.",
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
