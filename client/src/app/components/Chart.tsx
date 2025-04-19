"use client";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import React, { useEffect, useState } from "react";
import { Transaction } from "@/lib/types";

interface Props {
  Data: Transaction[];
}

const Chart = ({ Data }: Props) => {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  // Prepare data for BarChart (e.g., sum amounts by categories)
  const categories = Array.from(new Set(Data.map((item) => item.Category)));

  const barChartData = categories.map((category) => {
    const total = Data.filter((item) => item.Category === category).reduce(
      (sum, item) => sum + item.Amount,
      0
    );
    return total;
  });

  // Prepare data for PieChart (group amounts by type)
  useEffect(() => {
    const incomeTotal = Data.reduce(
      (prev: number, curr: Transaction) =>
        curr.type === "Income" ? prev + Number(curr.Amount) : prev,
      0
    );

    const expenseTotal = Data.reduce(
      (prev: number, curr: Transaction) =>
        curr.type === "Expenses" ? prev + Number(curr.Amount) : prev,
      0
    );

    const totalAmount = incomeTotal + expenseTotal;
    setIncome(incomeTotal);
    setExpenses(expenseTotal);
    setTotal(totalAmount);
  }, [Data]);

  const pieChartData = [
    {
      id: "Income",
      value: income,
      label: `Income (${((income / total) * 100).toFixed(2)}%)`,
    },
    {
      id: "Expenses",
      value: expenses,
      label: `Expenses (${((expenses / total) * 100).toFixed(2)}%)`,
    },
  ];

  return (
    <div className="bg-white border mt-5 rounded-xl shadow-xl p-5">
      {/* Bar Chart */}
      <h1 className="text-center mb-5 font-bold text-xl">
        Category-wise Spending
      </h1>
      <BarChart
        className="w-full"
        xAxis={[
          {
            id: "barCategories",
            data: categories,
            scaleType: "band",
            label: "Categories",
          },
        ]}
        yAxis={[
          {
            id: "barAmounts",
            label: "Amount ($)",
          },
        ]}
        series={[
          {
            data: barChartData,
            label: "Total Amount",
          },
        ]}
        width={600}
        height={300}
      />

      <hr className="my-8" />

      {/* Pie Chart */}
      <h1 className="text-center mb-5 font-bold text-xl">Income vs Expenses</h1>
      <PieChart
        className="w-full"
        series={[
          {
            data: pieChartData,
          },
        ]}
        width={400}
        height={300}
      />
    </div>
  );
};

export default Chart;
