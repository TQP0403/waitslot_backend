import { Logger } from "@nestjs/common";
import { KycInterface } from "./kyc.interface";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { AppError, ERROR_CODE, env } from "@configs/index";
import { isDefined } from "class-validator";

type SmsType = "Transactional" | "Promotional";

export class KycPhoneService implements KycInterface {
  private readonly snsClient: SNSClient;
  private readonly sender: string = "Blockx";
  private readonly smsType: SmsType = "Transactional";

  constructor(private readonly logger: Logger) {
    this.snsClient = new SNSClient({
      apiVersion: "2010-03-31",
      region: env.aws.region,
      credentials: {
        accessKeyId: env.aws.accessKey,
        secretAccessKey: env.aws.secretKey,
      },
    });
  }

  public async send(phone: string, token: string): Promise<void> {
    try {
      const command = new PublishCommand({
        Message: token,
        // One of PhoneNumber, TopicArn, or TargetArn must be specified.
        PhoneNumber: phone,
        MessageAttributes: {
          "AWS.SNS.SMS.SenderID": {
            DataType: "String",
            StringValue: this.sender,
          },
          "AWS.SNS.SMS.SMSType": {
            DataType: "String",
            StringValue: this.smsType,
          },
        },
      });

      const response = await this.snsClient.send(command);
      response.$metadata.httpStatusCode;

      if (
        isDefined(response.$metadata.httpStatusCode) &&
        response.$metadata.httpStatusCode < 400
      ) {
        this.logger.log(`verification sms sent to ${phone}`);
      } else {
        this.logger.log(response);
      }
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
