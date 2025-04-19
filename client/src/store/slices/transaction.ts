import backedUrl from "@/lib/apiurl";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface transactionProps {
  type: string;
  userId: string;
  Amount: string;
  Category: string;
  Description: string;
  Date: string;
}

export const addTransaction = createAsyncThunk(
  "addTransaction",
  async (data: transactionProps, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backedUrl}/api/finance/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        return response; // Return Response when successful
      } else {
        // Handle non-ok responses by rejecting with an error
        const error = await response.json();
        return rejectWithValue(error || "Failed to add transaction");
      }
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

// Define the state interface
interface TransactionState {
  transactions: transactionProps[];
  loading: boolean;
  error: unknown | null;
  response: Response | null;
}

const transaction = createSlice({
  name: "counter",
  initialState: {
    transactions: [],
    loading: false,
    error: null,
    response: null,
  } as TransactionState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addTransaction.fulfilled,
        (state, action: PayloadAction<Response>) => {
          state.loading = false;
          state.error = null;
          state.response = action.payload;
        }
      )
      .addCase(
        addTransaction.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default transaction.reducer;
