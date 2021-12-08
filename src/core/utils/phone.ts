import PhoneNumber from "awesome-phonenumber";

export class PhoneNumberUtil {
  static format(rawPhoneNumber: string): string {
    if (rawPhoneNumber) {
      const phoneNumber = new PhoneNumber(rawPhoneNumber, "VN");
      if (phoneNumber.isValid) {
        return phoneNumber.getNumber();
      }
    }
    return null;
  }
}
