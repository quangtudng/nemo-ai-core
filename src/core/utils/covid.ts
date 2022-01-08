import axios from "axios";
import { ProjectLogger } from "./loggers/log-service";

export class CovidUtil {
  private static async fetchCovidApi() {
    let covidStats = [];
    try {
      const response = await axios.get(
        "https://api.apify.com/v2/key-value-stores/ZsOpZgeg7dFS1rgfM/records/LATEST",
      );
      if (response.status === 200) {
        covidStats = response.data.detail || [];
        return covidStats;
      } else {
        ProjectLogger.exception(JSON.stringify(response.data));
        return covidStats;
      }
    } catch (error) {
      ProjectLogger.exception(error);
      return covidStats;
    }
  }
  private static getTotalObject(data: any[]) {
    const result = {
      name: "Việt Nam",
      death: 0,
      treating: 0,
      cases: 0,
      recovered: 0,
      casesToday: 0,
    };
    data.forEach((loc) => {
      result.cases += loc.cases;
      result.casesToday += loc.casesToday;
      result.death += loc.death;
      result.recovered += loc.recovered;
      result.treating += loc.treating;
    });
    return result;
  }

  private static matchLocationObject(name: string, data: any[]) {
    let result = {
      name,
      death: 0,
      treating: 0,
      cases: 0,
      recovered: 0,
      casesToday: 0,
    };
    data.forEach((loc) => {
      if (loc.name?.includes(name)) {
        result = { ...result, ...loc };
      }
    });
    return result;
  }

  static async getCovidStatisticByName(name: string) {
    let covidResponse = null;
    const covidData = await this.fetchCovidApi();
    if (covidData?.length > 0) {
      if (name.includes("Việt Nam")) {
        covidResponse = this.getTotalObject(covidData);
      } else {
        covidResponse = this.matchLocationObject(name, covidData);
      }
    }
    return covidResponse;
  }
}
