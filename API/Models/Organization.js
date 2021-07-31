import { model, Schema } from 'mongoose';

const organization = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        level: {
            type: Number,
            required: true
        },
        parent: {
            type: String
        }
    }
);
const Organization = model('Organization', organization, 'Organization');

export { Organization };
