export class ObjectHelper {
  public static deepCopyAttribute<T>(cloneToObj: T, cloneFromObj: T): void {
    for (var attribute in cloneFromObj) {
      if (typeof cloneFromObj[attribute] === "object") {
        this.deepCopyAttribute(cloneToObj[attribute], cloneFromObj[attribute]);
      } else {
        cloneToObj[attribute] = cloneFromObj[attribute];
      }
    }
  }
}
