import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from 'src/admin/models/session.model';

@Injectable()
export class SessionService {
    constructor(@InjectModel(Session.name) private sessionModel: Model<Session>) { }

    async createSession(userId: string, token: string) {
        // Create a session
        const session = new this.sessionModel({
            user_id: userId,
            session_token: token
        });

        await session.save();
        console.log('Session created successfully');
    }

    async validateSession(token: string) {
        const session = await this.sessionModel.findOne({ session_token: token });
        if (!session) {
            throw new Error('Invalid session');
        }
        return session;
    }
}