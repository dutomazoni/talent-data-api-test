import { model, Schema } from 'mongoose';

const product = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true
        },
        material: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        tags: [String]

    }
);
const Product = model('Product', product, 'Products');

export { Product };
