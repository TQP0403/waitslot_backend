import { PipeTransform, ArgumentMetadata } from "@nestjs/common";

export class PayloadValidationPipe implements PipeTransform {
  constructor() {}

  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (typeof value == "string") {
      value = JSON.parse(value);
    }
    return value;
  }
}
