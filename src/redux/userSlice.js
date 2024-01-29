import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: [],
  reducers: {
    addUser: {
      reducer: (state, action) => {
        const newUser = action.payload;
        if (!state.includes(newUser)) {
          state.push(newUser);
        }
      },
      prepare: (newUser) => ({ payload: newUser }),
    },
    removeUser: (state, action) => {
      const removedUser = action.payload;
      return state.filter(user => user !== removedUser);
    },
  },
});


export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
