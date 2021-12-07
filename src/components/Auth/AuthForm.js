import { useRef, Fragment, useContext } from "react";
import LoginContext from "../../store/loginContext";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const LoginCnxt = useContext(LoginContext);
  const usernameInput = useRef();
  const passwordInput = useRef();

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const enteredUsername = usernameInput.current.value;
    const enteredPassword = passwordInput.current.value;
    const crdentials = {
      enteredUsername: enteredUsername,
      enteredPassword: enteredPassword,
    };
    // add validation here
    LoginCnxt.authHandler(crdentials);
  };
  return (
    <Fragment>
      <section className={classes.auth}>
        <h1>{LoginCnxt.isLogin ? "Login" : "Sign Up"}</h1>
        <form onSubmit={formSubmitHandler}>
          <div className={classes.control}>
            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" required ref={usernameInput} />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Your Password</label>
            <input type="password" id="password" required ref={passwordInput} />
          </div>
          <div className={classes.actions}>
            {LoginCnxt.isLoading ? (
              <p>Sending data ....</p>
            ) : (
              <button>{LoginCnxt.isLogin ? "Login" : "Create Account"}</button>
            )}

            <button
              type="button"
              className={classes.toggle}
              onClick={LoginCnxt.switchAuthModeHandler}
            >
              {LoginCnxt.isLogin
                ? "Create new account"
                : "Login with existing account"}
            </button>
          </div>
        </form>
      </section>
      <section className={classes.error}>
        {LoginCnxt.error ? LoginCnxt.errormessage : LoginCnxt.userToken}
      </section>
    </Fragment>
  );
};

export default AuthForm;
