import mongoose, { Schema, Document } from 'mongoose';


interface IBook extends Document {
  bookTitle: string;
  authorName: string;
  price: number;
  description: string;
  imageUrl: string; 
  category: 'main' | 'fiction' | 'non-fiction' | 'science' | 'history';
  user: mongoose.Types.ObjectId;
}


const bookSchema: Schema<IBook> = new Schema({
  bookTitle: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [1, 'Price must be greater than 0'],
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    enum: ['main', 'fiction', 'non-fiction', 'science', 'history'],
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true }); 

const Book = mongoose.models.Book || mongoose.model<IBook>('Book', bookSchema);
export default Book;
