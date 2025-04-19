"use client";

import AddTransaction from "./components/AddTransaction";
import Data from "./components/Data";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import EditTransaction from "./components/EditTransactions";
import backedUrl from "@/lib/apiurl";
import { Transaction } from "@/lib/types";
import Navbar from "./components/Navbar";

export default function Home() {
  const [data, setData] = useState<Transaction[]>([]);
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [update, setUpdate] = useState<boolean>(false);
  const [updateVal, setUpdateVal] = useState<Transaction | null>(null);
  const [itemId, setItemId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token && token.length > 0) {
      const parsedToken = JSON.parse(atob(token.split(".")[1] as string));
      if (parsedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("Token");
        router.push("/login");
      } else {
        setUserId(parsedToken.id);
      }
    } else {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${backedUrl}/api/finance/getSingle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        const val = await response.json();
        if (response.ok) {
          setData(val.message);
        }
      } catch (error: unknown) {
        toast.error(String(error));
      }
    };
    if (userId) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Added userId to dependency array

  return (
    <>
      <Navbar data={data} />
      <div className="flex flex-col lg:flex-row gap-14 px-4 py-5 md:px-6 lg:px-8 xl:px-32">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/3 xl:w-96">
          {update ? (
            <EditTransaction
              setData={setData}
              updateVal={updateVal!}
              itemId={itemId}
              update={update}
              setUpdate={setUpdate}
              Data={data}
            />
          ) : (
            <AddTransaction setData={setData} />
          )}
        </div>

        {/* Right side - Data table */}
        <div className="w-full lg:w-2/3">
          <Data
            data={data}
            setData={setData}
            setUpdate={setUpdate}
            update={update}
            setUpdateVal={setUpdateVal}
            setItemId={setItemId}
          />
        </div>
      </div>
    </>
  );
}
