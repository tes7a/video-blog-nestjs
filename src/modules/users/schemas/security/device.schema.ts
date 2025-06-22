import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeviceDocument = Device & Document;

@Schema({ versionKey: false })
export class Device {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  ip: string;

  @Prop({ type: String })
  title: string; // user-agent

  @Prop({ type: String })
  lastActiveDate: string;

  @Prop({ type: String })
  deviceId: string;

  @Prop({ type: String })
  userId: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
