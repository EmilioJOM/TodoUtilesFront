const searchSlice = createSlice({
  name: "search",
  initialState: { query: "" },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    }
  }
});
