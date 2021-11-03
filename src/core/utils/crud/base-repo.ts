import { DeepPartial, DeleteResult, Repository } from "typeorm";
import { BaseFilterDTO } from "@core/dto/filter-many";

/**
 * @Usage Base repository class for crud purposes. Please extend from this class when creating new repository classes and add additional methods if needed.
 */
export class BaseCrudRepository<T> extends Repository<T> {
  createOne(dto: DeepPartial<T>): Promise<T> {
    const entity = this.create(dto);
    return this.save(entity);
  }

  async findMany(param: BaseFilterDTO): Promise<[T[], number]> {
    const limit = param.limit || 5;
    const offset = param.page && param.page > 1 ? (param.page - 1) * limit : 0;
    return this.createQueryBuilder(this.metadata.targetName)
      .take(limit)
      .skip(offset)
      .getManyAndCount();
  }

  async updateOne(id: number, dto: DeepPartial<T>): Promise<T> {
    let entity = await this.findOneOrFail(id);
    entity = {
      ...entity,
      ...dto,
    };
    return this.save(entity);
  }

  async deleteOne(id: number, exception = false): Promise<DeleteResult> {
    if (exception) {
      await this.findOneOrFail(id);
    }
    return this.delete(id);
  }
}
