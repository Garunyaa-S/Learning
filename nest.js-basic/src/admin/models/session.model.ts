import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ versionKey: false })
export class Session {
    @Prop({ required: true, ref: 'Admin' })
    user_id: ObjectId;

    @Prop({ required: true })
    session_token: string;

    @Prop({ default: 1 })
    status: number;

    @Prop({ default: Date.now })
    created_at: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);