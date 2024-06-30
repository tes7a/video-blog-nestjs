import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

import { AccountData, AccountDataSchema } from './account-data.schema';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
} from './email-confirmation.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  id: string;

  @Prop({ type: String })
  token: string;

  @Prop({ type: AccountDataSchema })
  accountData: AccountData;

  @Prop({ type: EmailConfirmationSchema })
  emailConfirmation: EmailConfirmation;
}

export const UserSchema = SchemaFactory.createForClass(User);
