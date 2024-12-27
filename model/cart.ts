import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {
  userEmail: string;
  bookId: mongoose.Types.ObjectId;
  quantity: number;
}

const cartSchema: Schema = new Schema({
  userEmail: { type: String, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true, default: 1 },
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', cartSchema);

export default Cart;

