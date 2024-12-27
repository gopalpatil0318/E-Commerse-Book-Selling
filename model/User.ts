import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  mob: string;
  _id: Types.ObjectId; // Explicitly define _id as ObjectId
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  mob: { type: String, required: true },
});

const User = model<IUser>('User', UserSchema);

export default User;
