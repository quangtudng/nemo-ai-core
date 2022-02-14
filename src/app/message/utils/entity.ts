import { ProjectLogger } from "@core/utils/loggers/log-service";

export class EntityUtil {
  static extractValue(entities: any[], type: string): string {
    let entityValue = "";
    try {
      // Get all the entities of the given type and extract the confidence value
      const values = entities
        .filter((entity) => entity.name === type)
        .map((entity) => entity.confidence);

      if (values.length > 0) {
        const maxValue = Math.max(...values);
        // Right now, we only support single entity so we will get the entity with maximum confidence level
        const bestEntity = entities.find(function (entity) {
          return entity.confidence === maxValue && type === entity.name;
        });
        entityValue = bestEntity.value;
      }
    } catch (error) {
      ProjectLogger.exception(error);
    }
    return entityValue;
  }
}
