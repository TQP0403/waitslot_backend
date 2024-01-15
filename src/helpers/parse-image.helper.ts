import {
  ParseFilePipe,
  ParseFilePipeBuilder,
  FileValidator,
} from "@nestjs/common";
import * as fileType from "file-type-mime";
import { env } from "@configs/index";

const VALID_UPLOADS_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export interface CustomUploadTypeValidatorOptions {
  fileType: string[];
}

export class CustomUploadFileTypeValidator extends FileValidator {
  private _allowedMimeTypes: string[];

  constructor(
    protected readonly validationOptions: CustomUploadTypeValidatorOptions,
  ) {
    super(validationOptions);
    this._allowedMimeTypes = this.validationOptions.fileType;
  }

  public isValid(file?: Express.Multer.File): boolean {
    const response = fileType.parse(file.buffer);
    return this._allowedMimeTypes.includes(response.mime);
  }

  public buildErrorMessage(): string {
    return `Upload not allowed. Upload only files of type: ${this._allowedMimeTypes.join(
      ", ",
    )}`;
  }
}

const uploadFileTypeValidator = new CustomUploadFileTypeValidator({
  fileType: VALID_UPLOADS_MIME_TYPES,
});

export function createImageValidator(fileIsRequired?: boolean): ParseFilePipe {
  return new ParseFilePipeBuilder()
    .addValidator(uploadFileTypeValidator)
    .addMaxSizeValidator({
      maxSize: env.file.uploadLimit,
    })
    .build({
      fileIsRequired: fileIsRequired,
    });
}
