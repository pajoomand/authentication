import { useRef, useContext, Fragment } from "react";
import classes from "./ProfileForm.module.css";
import LoginContext from "../../store/loginContext";

const ProfileForm = () => {
  const newPasswordInput = useRef();
  const LoginCnxt = useContext(LoginContext);
  const passwordChangeHandler = (e) => {
    e.preventDefault();

    LoginCnxt.changePasswordHandler(newPasswordInput.current.value);
  };

  return (
    <Fragment>
      <form className={classes.form} onSubmit={passwordChangeHandler}>
        <div className={classes.control}>
          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" ref={newPasswordInput} />
        </div>
        <div className={classes.action}>
          <button>Change Password</button>
        </div>
      </form>
      <div className={classes.error}>
        {LoginCnxt.error && LoginCnxt.errormessage}
      </div>
    </Fragment>
  );
};

export default ProfileForm;
