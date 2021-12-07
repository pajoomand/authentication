import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const LoginCnxt = createContext({
  isLoading: false,
  isLogin: false,
  userIsLoggedIn: false,
  errormessage: "",
  userToken: "",
  error: false,
  authHandler: () => {},
  switchAuthModeHandler: () => {},
  logoutHandler: () => {},
  changePasswordHandler: () => {},
});
const calculateRemainingTime = (expirationTime) => {
  // expirationTime is passed as string
  const currentTime = new Date().getTime(); // to get the current time
  const adjustedExpirationTime = new Date(expirationTime).getTime(); // expirationTime is converted to Date type
  const remaininDuration = adjustedExpirationTime - currentTime;
  return remaininDuration; // the remaining duration is returned in milliseconds
};

export const LogInContextProvider = (props) => {
  const [isLogin, setIsLogin] = useState(true);
  const [errormessage, setErrorMessage] = useState("Authentication failed");
  let tokenData = localStorage.getItem("userToken");
  const storedExpirationTIme = localStorage.getItem("expirationTime");
  const remainingTime = calculateRemainingTime(storedExpirationTIme);
  let initialToken;
  if (remainingTime < 0) {
    localStorage.removeItem("expirationTime"); //this happens if the token is expired; so let's remove info from local storage
    localStorage.removeItem("userToken");
  } else {
    initialToken = tokenData; //if stored token is valid, we store it in initialToken which activates useEffect function below
  }
  const [userToken, setUserToken] = useState(initialToken); // lets store the token from the browser memory if still available
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const logoutHandler = () => {
    setUserToken(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("expirationTime"); //to remove the expiration time from the browser. This variable has to be a string
  };
  const loginHandler = (token, expirationTime) => {
    setUserToken(token);
    localStorage.setItem("userToken", token);
    localStorage.setItem("expirationTime", expirationTime); //to store the expiration time in the browser, has to be string
    const remainingTime = calculateRemainingTime(expirationTime);
    setTimeout(logoutHandler, remainingTime);

    history.replace("/auth");
  };

  const authHandler = (crdentials) => {
    let url;
    isLogin
      ? (url =
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyACotLOIsZTWkiya4tEAbvtkjhdrwvtUKQ")
      : (url =
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyACotLOIsZTWkiya4tEAbvtkjhdrwvtUKQ");

    setIsLoading(true);
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: crdentials.enteredUsername,
        password: crdentials.enteredPassword,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        setIsLoading(false);
        const data = await res.json();
        if (res.ok) {
          setError(false);
          const expirationTime = new Date(
            new Date().getTime() + +data.expiresIn * 1000 //data.expiresIn is string in seconds, so we convert it into number and multiply by 1000 to get miliseconds
          );
          loginHandler(data.idToken, expirationTime.toISOString()); // we pass the expirationTime as string because we convert it to date type in calculateRemainingTime
        } else {
          throw new Error(data.error.message || "Authentication failed");
        }
      })
      .catch((error) => {
        setError(true);
        setErrorMessage(error.message);
      });
  };

  const changePasswordHandler = (newPassword) => {
    if (!userToken) {
      setError(true);
      setErrorMessage("Password cannot change if the user is not logged in");
      return;
    }
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyACotLOIsZTWkiya4tEAbvtkjhdrwvtUKQ";

    setIsLoading(true);
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        idToken: userToken,
        password: newPassword,
        returnSecureToken: false,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        setIsLoading(false);
        const data = await res.json();
        if (res.ok) {
          setError(false);
          setUserToken(data.idToken);
          history.replace("/");
        } else {
          throw new Error(data.error.message || "Authentication failed");
        }
      })
      .catch((error) => {
        setError(true);
        setErrorMessage(error.message);
      });
  };

  useEffect(() => {
    setTimeout(logoutHandler, remainingTime); // we have to do this inside useEffect becase logoutHandler function is defined after where we have initialToken = tokenData;
  }, [initialToken]);

  const context = {
    isLoading: isLoading,
    isLogin: isLogin,
    userIsLoggedIn: !!userToken,
    errormessage: errormessage,
    userToken: userToken,
    error: error,
    authHandler: authHandler,
    switchAuthModeHandler: switchAuthModeHandler,
    logoutHandler: logoutHandler,
    changePasswordHandler: changePasswordHandler,
  };

  return (
    <LoginCnxt.Provider value={context}>{props.children}</LoginCnxt.Provider>
  );
};
export default LoginCnxt;
