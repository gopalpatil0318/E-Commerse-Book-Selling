"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import fiction from "@/public/non-fiction.png";

interface FormData {
  name: string;
  mob: string;
  email: string;
  password: string;
}

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mob: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!regex.test(password)) {
      return "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Signup failed");
      }
      toast.success("Signed up successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Error during registration", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="relative h-20 w-20 mx-auto">
            <Image
              src={fiction}
              alt=""
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Register
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-md px-3 py-1.5 bg-white text-gray-900"
              />
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="mob" className="block text-sm font-medium text-gray-900">
                Mobile no
              </label>
              <input
                id="mob"
                name="mob"
                type="number"
                required
                value={formData.mob}
                onChange={handleChange}
                className="block w-full rounded-md px-3 py-1.5 bg-white text-gray-900"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md px-3 py-1.5 bg-white text-gray-900"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md px-3 py-1.5 bg-white text-gray-900"
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-[#009999] px-3 py-1.5 text-white"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already Registered?{" "}
            <Link href="/login" className="text-[#009999] font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
