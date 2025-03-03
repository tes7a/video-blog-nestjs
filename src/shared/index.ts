import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedConfig {
  getEmail() {
    return process.env.EMAIL ?? 'youremail@test.com';
  }
  getEmailPassword() {
    return process.env.EMAIL_PASSWORD ?? 'password';
  }

  getEmailService() {
    return process.env.EMAIL_SERVICE ?? 'gmail';
  }

  getMongoUrlDb() {
    return process.env.MONGO_URL ?? 'mongodb://localhost:27017';
  }
}
