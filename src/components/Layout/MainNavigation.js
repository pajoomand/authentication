import { Link } from "react-router-dom";
import { useContext } from "react";
import LoginContext from "../../store/loginContext";
import { useHistory } from "react-router-dom";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const history = useHistory();
  const LoginCnxt = useContext(LoginContext);

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!LoginCnxt.userIsLoggedIn ? (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          ) : (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}

          {LoginCnxt.userIsLoggedIn && (
            <li>
              <button
                onClick={(e) => {
                  LoginCnxt.logoutHandler();
                  history.replace("/auth");
                }}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
