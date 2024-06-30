import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class AccountData {
  @Prop({ required: true, type: String })
  login: string;

  @Prop()
  passwordHash: string;

  @Prop()
  passwordSalt: string;

  @Prop({ default: '' })
  recoveryCode: string;

  @Prop()
  email: string;

  @Prop()
  createdAt: string;
}

export const AccountDataSchema = SchemaFactory.createForClass(AccountData);
