// Check if the user is an admin after login
export const login = (email, password) => async (dispatch) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user role from Firestore or another source
    const userRole = 'admin'; // Assume this is fetched from Firestore or another API

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        role: userRole,
      },
    });

    const token = await user.getIdToken();
    localStorage.setItem('token', token);
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.message,
    });
  }
};
