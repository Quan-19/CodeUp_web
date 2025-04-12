export const fetchCourses = () => {
    return (dispatch) => {
      // Giả lập dữ liệu
      const mockCourses = [
        { _id: '1', title: 'React cơ bản', price: 0, description: '...', thumbnail: '...' },
        { _id: '2', title: 'Node.js nâng cao', price: 500000, description: '...', thumbnail: '...' }
      ];
  
      dispatch({ type: 'FETCH_COURSES_SUCCESS', payload: mockCourses });
    };
  };
  