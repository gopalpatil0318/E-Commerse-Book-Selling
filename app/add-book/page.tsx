'use client'

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation';

// Define the TypeScript type for the form data
interface BookFormData {
  bookTitle: string;
  authorName: string;
  price: number;
  description: string;
  imageUrl: string | null; 
  category: string;
}

// Cloudinary image upload function
const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'gopaluploadpreset');
  formData.append('cloud_name', 'dae4fjmsn');

  try {
    const response = await axios.post('https://api.cloudinary.com/v1_1/dae4fjmsn/image/upload/', formData);
    return response.data.url; // Return the image URL
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

export default function AddBook() {
  const router = useRouter();
  const [formData, setFormData] = useState<BookFormData>({
    bookTitle: '',
    authorName: '',
    price: 0,
    description: '',
    imageUrl: null,
    category: 'main', // default category
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file), 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = formData.imageUrl;
      if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
        // This means it's a File object, so we need to upload it
        const file = await fetch(formData.imageUrl).then(r => r.blob());
        imageUrl = await uploadImage(file as File);
      }

      const response = await axios.post('/api/books', {
        ...formData,
        imageUrl,
      });

      console.log('Book added:', response.data);
      router.push('/home'); // Redirect to home page after successful addition
    } catch (error) {
      console.error('Error adding book:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-[#009999] p-3 flex justify-between">
        <h4 className="text-xl/9 font-bold pl-2 text-white">Add Book</h4>
      </div>

      <div className="flex px-6 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="bookTitle" className="block text-sm/6 font-medium text-gray-900">Book Title</label>
              <div className="mt-2">
                <input
                  id="bookTitle"
                  name="bookTitle"
                  type="text"
                  required
                  value={formData.bookTitle}
                  onChange={handleInputChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#009999] sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="authorName" className="block text-sm/6 font-medium text-gray-900">Author Name</label>
              <div className="mt-2">
                <input
                  id="authorName"
                  name="authorName"
                  type="text"
                  required
                  value={formData.authorName}
                  onChange={handleInputChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#009999] sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">Price</label>
              <div className="mt-2">
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#009999] sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">Description</label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#009999] sm:text-sm/6"
                ></textarea>
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm/6 font-medium text-gray-900">Upload Book Image</label>
              <div className="mt-2">
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#009999] sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm/6 font-medium text-gray-900">Category</label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#009999] sm:text-sm/6"
                >
                  <option value="main">Main</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="science">Science</option>
                  <option value="history">History</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex mt-4 w-full justify-center rounded-md bg-[#009999] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#006666] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009999]"
              >
                Add New Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

