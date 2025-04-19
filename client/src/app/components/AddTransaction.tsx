"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import backedUrl from "@/lib/apiurl";
import { AddTransactionProps, Transaction } from "@/lib/types";

const formSchema = z.object({
  type: z.string(),
  Amount: z.string(),
  Category: z.string(),
  Description: z.string().min(1, "Enter description more than one character"),
  Date: z.string(),
});

interface props {
  setData: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const AddTransaction = ({ setData }: props) => {
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

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
    }
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      Amount: "",
      Category: "",
      Description: "",
      Date: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (userId) {
      const val: AddTransactionProps = {
        type: values.type,
        userId: userId,
        Amount: Number(values.Amount),
        Category: values.Category,
        Description: values.Description,
        Date: values.Date,
      };
      try {
        const response = await fetch(`${backedUrl}/api/finance/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(val),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message);
          setData((prev: Transaction[]) => [...prev, data.transactions]);
        }
      } catch (error: unknown) {
        toast.error(String(error));
      }
      toast.success("Transaction added successfully");
    }
  };

  return (
    <div>
      <div className="bg-white   px-5 py-5 rounded shadow  max-lg:w-full  max-xl:w-96">
        <h3 className="font-bold mb-2 text-xl">Add New Transaction</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-bold">
                    Type
                  </FormLabel>
                  <br />
                  <FormControl>
                    <select
                      {...field}
                      className="border border-gray-300 px-3 py-2 rounded shadow outline-none w-full"
                    >
                      <option value="" disabled>
                        Select Type
                      </option>
                      <option value="Expenses">Expenses</option>
                      <option value="Income">Income</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="Amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-bold ">
                    Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.00"
                      {...field}
                      className="outline-none border-gray-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="Category"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-bold">
                    Category
                  </FormLabel>
                  <br />
                  <FormControl>
                    <select
                      {...field}
                      className="border border-gray-300 px-3 py-2 rounded shadow outline-none w-full"
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      <option value="Food & Dining">Food & Dining</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Bills & utilities">
                        Bills & utilities
                      </option>
                      <option value="Salary">Salary</option>
                      <option value="Investment">Investment</option>
                      <option value="others">others</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="Description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-bold ">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="Date"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 font-bold ">
                    Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Select a Date"
                      {...field}
                      type="Date"
                      className="outline-none border-gray-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 w-full"
            >
              <PlusCircle /> Add Transaction
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddTransaction;
