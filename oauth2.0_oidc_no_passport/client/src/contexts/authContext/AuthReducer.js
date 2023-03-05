const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        loading: false,
        success: true,
        error: false,
      };
    case "CLEAR_USER":
      return {
        ...state,
        user: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        loading: false,
        error: true,
        success: false,
        message: action.payload,
      };
    case "RESET":
      return {
        ...state,
        loading: false,
        error: false,
        success: false,
        message: "",
      };
    default:
      return state;
  }
};

export default authReducer;
