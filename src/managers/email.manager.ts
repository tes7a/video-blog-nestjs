import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { SharedConfig } from 'src/shared';
const nodemailer = require('nodemailer');
@Injectable()
export class EmailManager {
  private transport;
  constructor(private sharedConfig: SharedConfig) {
    this.transport = nodemailer.createTransport({
      service: this.sharedConfig.getEmailService(),
      auth: {
        user: this.sharedConfig.getEmail(),
        pass: this.sharedConfig.getEmailPassword(),
      },
    });
  }

  async sendEmail(
    email: string,
    confirmationCode: string,
  ): Promise<SentMessageInfo> {
    const template = `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
    </p>`;

    return await this.transport.sendMail({
      from: 'Support Team <support@mail.com>',
      to: email,
      subject: 'Support Team',
      html: template,
    });
  }

  async passwordRecover(
    email: string,
    recoveryPassword: string,
  ): Promise<SentMessageInfo> {
    const template = `<h1>Password recovery</h1>
    <p>To finish password recovery please follow the link below:
       <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryPassword}'>recovery password</a>
   </p>`;

    return await this.transport.sendMail({
      from: 'Support Team <support@mail.com>',
      to: email,
      subject: 'Support Team',
      html: template,
    });
  }
}
