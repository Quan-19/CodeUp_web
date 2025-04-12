const initialState = {
    courses: []
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_COURSES_SUCCESS':
        return {
          ...state,
          courses: action.payload
        };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  