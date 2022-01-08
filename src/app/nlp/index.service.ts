import { Injectable } from "@nestjs/common";
import { BaseCrudService } from "@core/utils/crud/base-service";
import { Nlp } from "./index.entity";
import { NlpRepository } from "./index.repository";
import axios from "axios";
import { RASA_SERVER } from "@config/env";
import { ProjectLogger } from "@core/utils/loggers/log-service";

@Injectable()
export class NlpService extends BaseCrudService<Nlp> {
  constructor(private repo: NlpRepository) {
    super(repo);
  }

  async parse(text: string) {
    const CONFIDENCE_THRESHOLD = 0.75;
    const nlpParsedResponse = {
      intent: {
        name: null,
        confidence: 0,
      },
      entities: [],
    };
    try {
      const response = await axios.post(RASA_SERVER, {
        text,
      });
      if (response.status === 200) {
        const data = response.data;
        await this.repo.createOne({
          body: text,
          result: JSON.stringify(data),
        });
        if (data.intent && data.intent.confidence >= CONFIDENCE_THRESHOLD) {
          nlpParsedResponse.intent.name = data.intent.name;
          nlpParsedResponse.intent.confidence = data.intent.confidence;
        }
        if (data.entities?.length > 0) {
          nlpParsedResponse.entities = data.entities
            .filter(
              (entity: any) => entity.confidence_entity >= CONFIDENCE_THRESHOLD,
            )
            .map((entity: any) => ({
              name: entity.entity,
              confidence: entity.confidence_entity,
              value: entity.value,
            }));
        }
        ProjectLogger.info(JSON.stringify(nlpParsedResponse));
        return nlpParsedResponse;
      } else {
        ProjectLogger.exception(response.data);
        return nlpParsedResponse;
      }
    } catch (e) {
      ProjectLogger.exception(e);
      return nlpParsedResponse;
    }
  }
}
