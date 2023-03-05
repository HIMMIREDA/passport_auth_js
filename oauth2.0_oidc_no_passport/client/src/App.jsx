import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import { ColorModeProvider } from "./contexts/ColorModeContext";
import { AuthProvider } from "./contexts/authContext/AuthContext";
import PersistLogin from "./components/PersistLogin";

function App() {
  return (
    <>
      <ColorModeProvider>
        <AuthProvider>
          <Router>
            <div className="container">
              <Routes>
                <Route element={<PersistLogin />}>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/login" element={<SignIn />} />
                  <Route path="/register" element={<SignUp />} />
                  <Route path="*" element={<p>Not Found 404</p>} />
                </Route>
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ColorModeProvider>
    </>
  );
}

export default App;
