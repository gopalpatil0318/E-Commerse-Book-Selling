'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";

// TypeScript types
interface User {
  name: string;
  email: string;
  mob: string;
  
}

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session.user) {
      fetchUserData();
    }
  }, [status, session, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user data", err);
      setError("Failed to load user data. Please try again later.");
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <>
      {/* Header */}
      <div className="bg-[#009999] p-3 flex justify-between">
        <h4 className="text-xl/9 font-bold pl-2 text-white">My Profile</h4>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <FaUserCircle className="text-[80px] text-gray-200 mt-8" />
        <h5 className="mt-6 text-2xl/9 font-bold tracking-tight text-gray-900">
          {user.name}
        </h5>
        <p className="py-2">
          <b>Email: </b>
          {user.email}
        </p>
        <p className="py-2">
          <b>Mobile: </b>
          {user.mob}
        </p>
        

        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          type="button"
          className="mt-4  text-[#009999] hover:text-white border border-[#009999] hover:bg-[#009999] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        >
          Logout
        </button>

        <hr className="m-4" />

        {/* My Orders Link */}
        <Link href="/my-order">
          <p>
            <b>My Orders</b>
          </p>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
}

