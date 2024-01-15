import { Logger } from "@nestjs/common";
import { createTransport, Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import * as handlebars from "handlebars";
import { KycInterface } from "./kyc.interface";
import { AppError, env, ERROR_CODE } from "@configs/index";
import { LocalFileHelper } from "@helpers/index";
import * as aws from "@aws-sdk/client-ses";

export class KycMailService implements KycInterface {
  private readonly transport: Transporter;
  private readonly sender: string;
  private readonly subject: string;
  private readonly htmlTemplate: string;

  constructor(private readonly logger: Logger) {
    // gmail config
    // 1. go https://myaccount.google.com/security
    // 2. enable 2-Step Verification
    // 3. create App passwords

    this.sender = `"Blockx" <${env.smtp.mail}>`;
    this.subject = "Welcome to blockx";
    this.htmlTemplate = LocalFileHelper.read(
      "/templates/email-verification.template.html",
    );

    if (!env.smtp.user || !env.smtp.pass) {
      const ses = new aws.SES({
        apiVersion: "2010-12-01",
        region: env.aws.region,
        credentials: {
          accessKeyId: env.aws.accessKey,
          secretAccessKey: env.aws.secretKey,
        },
      });
      this.transport = createTransport({
        SES: { ses, aws },
        sendingRate: 1,
      });
    } else {
      this.transport = createTransport({
        service: "Gmail",
        auth: {
          user: env.smtp.user,
          pass: env.smtp.pass,
        },
      });
    }
  }

  public async send(email: string, token: string): Promise<void> {
    const template = handlebars.compile(this.htmlTemplate);

    const options: Mail.Options = {
      priority: "normal",
      to: email,
      from: this.sender,
      subject: this.subject,
      html: template({ token }),
    };

    try {
      await this.transport.sendMail(options);
      this.logger.log(`verification mail sent to ${email}`);
    } catch (error) {
      this.logger.error(error);
      throw new AppError(ERROR_CODE.SERVER_ERROR);
    }
  }
}
