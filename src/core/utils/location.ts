export class LocationUtil {
  static getTypeName(type: string) {
    let typeName = "";
    if (type === "country") {
      typeName = "quốc gia";
    }
    if (type === "city") {
      typeName = "thành phố";
    }
    if (type === "province") {
      typeName = "tỉnh";
    }
    return typeName;
  }
}
