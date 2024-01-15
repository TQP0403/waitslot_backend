export class ValidatorHelper {
  public static validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  public static validatePhone(phone: string) {
    const re = /^\+[1-9]\d{1,14}$/;
    return re.test(phone);
  }

  public static validateUsername(username: string) {
    const re = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    return !re.test(username);
  }
}
