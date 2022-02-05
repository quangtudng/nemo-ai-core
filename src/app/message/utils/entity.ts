import { ProjectLogger } from "@core/utils/loggers/log-service";
import { NLP_ENTITY } from "../constants/message";

export class EntityUtil {
  static hasLocationEntity(entities: any[]): boolean {
    try {
      if (entities.length > 0) {
        return entities.some((entity) => entity?.name === NLP_ENTITY.LOCATION);
      }
      return false;
    } catch (error) {
      ProjectLogger.exception(error);
      return false;
    }
  }

  static hasCovidEntity(entities: any[]): boolean {
    try {
      if (entities.length > 0) {
        return entities.some((entity) => entity?.name === NLP_ENTITY.COVID);
      }
      return false;
    } catch (error) {
      ProjectLogger.exception(error);
      return false;
    }
  }

  static hasServiceEntity(entities: any[]): boolean {
    try {
      if (entities.length > 0) {
        return entities.some((entity) => entity?.name === NLP_ENTITY.SERVICE);
      }
      return false;
    } catch (error) {
      ProjectLogger.exception(error);
      return false;
    }
  }

  static hasWeatherEntity(entities: any[]): boolean {
    try {
      if (entities.length > 0) {
        return entities.some((entity) => entity?.name === NLP_ENTITY.WEATHER);
      }
      return false;
    } catch (error) {
      ProjectLogger.exception(error);
      return false;
    }
  }
}
