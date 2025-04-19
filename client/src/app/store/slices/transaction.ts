import { baseUrl } from "@/lib/BaseUrl";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define the transaction type for TypeScript
interface TransactionProps {
  type: string;
  userId: string;
  Amount: string;
  Category: string;
  Description: string;
  Date: string;
}

// Define the API response type
interface AddTransactionResponse {
  message: string;
  data: TransactionProps;
}

// Define the shape of the state
interface TransactionState {
  transactions: TransactionProps[];
  loading: boolean;
  error: string | null;
  response: AddTransactionResponse | null;
}

export const addTransaction = createAsyncThunk<
  AddTransactionResponse,
  TransactionProps,
  { rejectValue: string }
>("addTransaction", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${baseUrl}/api/finance/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return rejectWithValue("Failed to add transaction");
    }

    const responseData: AddTransactionResponse = await response.json();
    return responseData;
  } catch (error: unknown) {
    return rejectWithValue(String(error));
  }
});

// Create a slice of state with actions
const transactionSlice = createSlice({
  name: "transaction",
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
        (state, action: PayloadAction<AddTransactionResponse>) => {
          state.loading = false;
          state.error = null;
          state.response = action.payload;
        }
      )
      .addCase(
        addTransaction.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "An unknown error occurred";
        }
      );
  },
});

export default transactionSlice.reducer;
