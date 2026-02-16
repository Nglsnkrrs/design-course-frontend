// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ModulesProvider } from "./context/ModulesContext";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Module from "./pages/Module";
import Lesson from "./pages/Lesson";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import Settings from "./pages/Settings";
import { RequireAuth } from "./components/RequireAuth";

function App() {
  return (
    <AuthProvider>
      <ModulesProvider>
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/course"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />

            <Route
              path="/module/:id"
              element={
                <RequireAuth>
                  <Module />
                </RequireAuth>
              }
            />

            <Route
              path="/lesson/:id"
              element={
                <RequireAuth>
                  <Lesson />
                </RequireAuth>
              }
            />

            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />

            <Route
              path="/achievements"
              element={
                <RequireAuth>
                  <Achievements />
                </RequireAuth>
              }
            />

            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <Settings />
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ModulesProvider>
    </AuthProvider>
  );
}

export default App;