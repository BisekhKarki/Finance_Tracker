"use client";

import { User, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"; // Added useCallback

// Define the Transaction interface to match the expected data structure
interface Transaction {
  _id: string;
  type: string;
  userId: string;
  Amount: number;
  Category: string;
  Description: string;
  Date: string;
}

interface Props {
  data: Array<Transaction>;
}

const Navbar = ({ data }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();
  const [token, setToken] = useState<string>("");

  const [balance, setBalance] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token && token.length > 0) {
      const parsedToken = JSON.parse(atob(token.split(".")[1] as string));
      if (parsedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("Token");
        router.push("/login");
      } else {
        // setUserId(parsedToken.id);
        setToken(token);
      }
    }
  }, [router]);

  const resetDataOnLogout = () => {
    setToken(""); // Clear token
    router.push("/login");
  };

  useEffect(() => {
    const totalIncome = data.reduce(
      (prev: number, curr: Transaction) =>
        curr.type === "Income" ? prev + Number(curr.Amount) : prev,
      0
    );

    const totalExpenses = data.reduce(
      (prev: number, curr: Transaction) =>
        curr.type === "Expenses" ? prev + Number(curr.Amount) : prev,
      0
    );
    const netBalance = totalIncome - totalExpenses;

    setIncome(totalIncome);
    setExpenses(totalExpenses);
    setBalance(netBalance);
  }, [data]);

  return (
    <div className="bg-white shadow flex flex-wrap items-center justify-between px-4 py-3 md:px-6 lg:px-8 xl:px-32 gap-4">
      {/* Logo/Brand */}
      <div className="font-bold flex gap-2 items-center text-lg md:text-xl lg:text-2xl">
        <Wallet className="text-blue-500" width={30} height={30} />
        <h2>Finance Tracker</h2>
      </div>

      {/* Financial Summary - Hidden on small screens if not enough space */}
      <div
        className={`flex ${
          token && token.length > 0 ? "gap-4" : "gap-4"
        } text-sm md:text-base mx-auto md:mx-0`}
      >
        {token && token.length > 0 ? (
          <>
            <div className="text-center min-w-[80px]">
              <p className="text-gray-500 whitespace-nowrap">Income</p>
              <p className={income < 0 ? "text-red-600" : "text-green-600"}>
                ${income}
              </p>
            </div>
            <div className="text-center min-w-[80px]">
              <p className="text-gray-500 whitespace-nowrap">Expenses</p>
              <p className={expenses > 0 ? "text-red-600" : "text-green-600"}>
                ${expenses}
              </p>
            </div>
            <div className="text-center min-w-[80px]">
              <p className="text-gray-500 whitespace-nowrap">Balance</p>
              <p className={balance < 0 ? "text-red-600" : "text-green-600"}>
                ${balance}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center min-w-[80px]">
              <p className="text-gray-500 whitespace-nowrap">Income</p>
              <p className="text-green-600">$0</p>
            </div>
            <div className="text-center min-w-[80px]">
              <p className="text-gray-500 whitespace-nowrap">Expenses</p>
              <p className="text-red-600">$0</p>
            </div>
            <div className="text-center min-w-[80px]">
              <p className="text-gray-500 whitespace-nowrap">Balance</p>
              <p className="text-green-600">$0</p>
            </div>
          </>
        )}
      </div>

      {/* User Menu */}
      <div className="relative ml-auto">
        <User
          className="cursor-pointer w-8 h-8"
          onClick={() => setShow(!show)}
        />
        {show && token && token.length > 0 && (
          <div className="absolute right-0 top-full mt-2 w-40 z-[1000]">
            <div className="bg-white shadow-2xl rounded-xl px-4 py-2 text-sm space-y-2 border border-gray-300">
              <ul>
                <li className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                  My Profile
                </li>
              </ul>
              <hr className="border-gray-200" />
              <ul>
                <li
                  className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                  onClick={() => {
                    localStorage.removeItem("Token");
                    router.push("/login");
                    resetDataOnLogout();
                    setShow(false);
                  }}
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
