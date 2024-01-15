import { Injectable, Logger } from "@nestjs/common";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { AppError, ERROR_CODE, env } from "@configs/index";
import * as path from "path";

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly s3CloudFront: string;
  private readonly s3Bucket: string;
  private readonly s3Client: S3Client;

  constructor() {
    this.s3CloudFront = env.aws.s3CloudFront;
    if (!this.s3CloudFront.endsWith("/")) {
      this.s3CloudFront = this.s3CloudFront.concat("/");
    }
    this.s3Bucket = env.aws.s3Bucket;
    this.s3Client = new S3Client({
      region: env.aws.region,
      credentials: {
        accessKeyId: env.aws.accessKey,
        secretAccessKey: env.aws.secretKey,
      },
    });
  }

  public async upload(
    file: Express.Multer.File,
    part: string = "images",
  ): Promise<string> {
    try {
      const filename = file.originalname.replace(/\s+/g, "-");
      const key = path.join(part, `${uuidv4()}-${filename}`);

      const command = new PutObjectCommand({
        Bucket: this.s3Bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      const response = await this.s3Client.send(command);
      // console.log({ response });
      return this.s3CloudFront.concat(key);
    } catch (error) {
      this.logger.error("AWS S3 upload file error:");
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }

  public async delete(url: string): Promise<void> {
    try {
      if (!url.startsWith(this.s3CloudFront)) return;

      const key = url.replace(this.s3CloudFront, "");

      const command = new DeleteObjectCommand({
        Bucket: this.s3Bucket,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      // console.log({ response });
    } catch (error) {
      this.logger.error("AWS S3 upload file error:");
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
