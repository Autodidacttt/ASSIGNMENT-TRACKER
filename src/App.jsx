import React, { useState, useEffect } from "react";
import { authAPI, assignmentAPI } from "./api";

import Login          from "./Login";
import AdminDashboard from "./Admindashboard";
import AddAssignment  from "./AddAssignment";
import AssignmentList from "./AssignmentList";
import Dashboard      from "./Dashboard";
import Calendar       from "./Calendar";
import Profile        from "./Profile";
import Subjects       from "./Subjects";
import Navbar         from "./Navbar";
import "./App.css";

function App() {
  const [user, setUser]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [activePage, setActivePage]   = useState("tracker");

  // Check existing JWT token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthLoading(false);
      return;
    }
    authAPI.me()
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const loadAssignments = async () => {
    if (!user || user.role === "admin") return;
    try {
      const { assignments } = await assignmentAPI.getAll();
      setAssignments(assignments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.role === "student") loadAssignments();
  }, [user]);

  const handleSetUser = async (u) => {
    if (!u) {
      authAPI.logout();
      setUser(null);
      setAssignments([]);
    } else {
      setUser(u);
    }
  };

  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-logo">AT</div>
        <div className="auth-loading-text">Loading...</div>
      </div>
    );
  }

  if (!user) return <Login setUser={handleSetUser} />;

  if (user.role === "admin") {
    return <AdminDashboard user={user} setUser={handleSetUser} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard assignments={assignments} />;
      case "calendar":
        return <Calendar assignments={assignments} loadAssignments={loadAssignments} userId={user._id} />;
      case "profile":
        return <Profile assignments={assignments} user={user} setUser={handleSetUser} />;
      case "subjects":
        return <Subjects assignments={assignments} loadAssignments={loadAssignments} userId={user._id} />;
      case "tracker":
      default:
        return (
          <div className="container">
            <h1 className="title">Assignment Tracker</h1>
            <AddAssignment loadAssignments={loadAssignments} userId={user._id} />
            <AssignmentList assignments={assignments} loadAssignments={loadAssignments} />
          </div>
        );
    }
  };

  return (
    <div className="app-layout">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="app-main">{renderPage()}</main>
    </div>
  );
}

export default App;
