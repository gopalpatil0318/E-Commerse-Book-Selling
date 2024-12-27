import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  book: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: Array<IOrderItem>;
  total: number;
  address: string;
  mobileNumber: string;
  paymentId: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
}

const OrderItemSchema: Schema = new Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'], 
    default: 'Pending'
  }
});

const OrderSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  address: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  paymentId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'], 
    default: 'Pending'
  }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

