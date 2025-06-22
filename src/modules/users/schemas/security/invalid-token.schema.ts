import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type InvalidTokenDocument = InvalidToken & Document;

@Schema({ timestamps: true })
export class InvalidToken {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const InvalidTokenSchema = SchemaFactory.createForClass(InvalidToken);
InvalidTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
