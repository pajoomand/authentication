import { Switch, Route, Redirect } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { useContext } from "react";
import LoginCnxt from "./store/loginContext";

function App() {
  const LoginContext = useContext(LoginCnxt);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>

        <Route path="/auth">
          <AuthPage />
        </Route>

        <Route path="/profile">
          {LoginContext.userIsLoggedIn ? (
            <UserProfile />
          ) : (
            <Redirect to="/auth" />
          )}
        </Route>
        <Route path="*">
          <AuthPage />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
