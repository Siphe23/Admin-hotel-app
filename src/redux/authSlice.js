import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebase'; // Import Firebase auth instance

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, status: null, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;
