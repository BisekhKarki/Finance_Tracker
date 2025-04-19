"use client";
import { Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import Chart from "./Chart";
import backedUrl from "@/lib/apiurl";
import { Transaction } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Values {
  data: Transaction[];
  setData: (data: Transaction[]) => void; // Adjusted to match expected type
  setUpdate: (update: boolean) => void;
  update: boolean;
  setUpdateVal: (data: Transaction) => void;
  setItemId: (itemId: string) => void;
}

const Data = ({
  data,
  setData,
  setUpdate,
  update,
  setUpdateVal,
  setItemId,
}: Values) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");

  const [token, setToken] = useState<string>("");

  const deleteItem = async (id: string) => {
    try {
      const reponse = await fetch(`${backedUrl}/api/finance/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const datas = await reponse.json();
      if (reponse.ok) {
        toast.success(datas.message);
        setData(data.filter((p: Transaction) => p._id !== id)); // Type prev as Transaction[] and fix callback
      }
    } catch (error: unknown) {
      toast.error(String(error));
    }
  };

  const getUserTransaction = async () => {
    if (!token) return router.push("/login");
    try {
      const response = await fetch(`${backedUrl}/api/finance/getSingle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const newData = await response.json();
      console.log(data);
      if (response.ok) {
        setData(newData.message); // Expecting data.message to be Transaction[]
      }
    } catch (error: unknown) {
      toast.error(String(error));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token && token.length > 0) {
      const parsedToken = JSON.parse(atob(token.split(".")[1] as string));
      if (parsedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("Token");
        router.push("/login");
      } else {
        setUserId(parsedToken.id);
        setToken(token);
      }
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      getUserTransaction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // getUserTransaction is now stable

  // console.log(data);

  return (
    <div className="w-full">
      {/* Wrapper for rounded corners and shadow */}
      <div className="bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden overflow-x-auto">
        <Table className="w-full overflow-x-auto">
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-200">
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {data && data.length > 0 ? (
            data.map((d, k) => (
              <TableBody key={k}>
                <TableRow>
                  <TableCell className="font-medium text-center">
                    {d.Date}
                  </TableCell>
                  <TableCell className="text-center">{d.type}</TableCell>
                  <TableCell className="text-center">{d.Category}</TableCell>
                  <TableCell className="text-center">{d.Description}</TableCell>
                  <TableCell className="text-center">{d.Amount}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Pencil
                        className="text-yellow-600 cursor-pointer"
                        onClick={() => {
                          console.log(d._id);
                          setUpdate(!update);
                          setItemId(d._id as string);
                          setUpdateVal({
                            _id: d._id,
                            type: d.type,
                            userId: d.userId, // Added missing userId property
                            Amount: d.Amount,
                            Category: d.Category,
                            Description: d.Description,
                            Date: d.Date,
                          });
                        }}
                      />
                      <Trash2
                        className="text-red-600 cursor-pointer"
                        onClick={() => {
                          console.log(d._id);
                          deleteItem(d._id);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))
          ) : (
            <TableBody className="text-center">
              <TableRow className="text-center">
                <TableCell>No Transaction available</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </div>
      <Chart Data={data} />
    </div>
  );
};

export default Data;
