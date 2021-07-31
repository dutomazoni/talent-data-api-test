import { model, Schema } from 'mongoose';

const user = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        roles: [String]

    }
);
const User = model('User', user, 'Users');

export { User };
