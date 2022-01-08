import { ProjectLogger } from "./loggers/log-service";

export class EmailUtil {
  static extractFromText(text: string): string {
    try {
      let email = null;
      if (text) {
        const re =
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        const match = text.match(re);
        if (match) {
          email = match[0];
        }
      }
      return email;
    } catch (error) {
      ProjectLogger.exception(error);
      return null;
    }
  }
}
