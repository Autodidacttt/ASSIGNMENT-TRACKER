import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import AddAssignment from "./AddAssignment";
import AssignmentList from "./AssignmentList";
import Dashboard from "./Dashboard";
import Calendar from "./Calendar";
import Profile from "./Profile";
import Subjects from "./Subjects";
import Navbar from "./Navbar";
import Login from "./Login";
import "./style.css";

function App() {
  const [loggedIn, setLoggedIn]   = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [activePage, setActivePage]   = useState("tracker");

  const loadAssignments = async () => {
    const querySnapshot = await getDocs(collection(db, "assignments"));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
    });
    setAssignments(list);
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  if (!loggedIn) {
    return <Login setLoggedIn={setLoggedIn} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard assignments={assignments} />;
      case "calendar":
        return <Calendar assignments={assignments} loadAssignments={loadAssignments} />;
      case "profile":
        return <Profile assignments={assignments} setLoggedIn={setLoggedIn} />;
      case "subjects":
        return (
          <Subjects
            assignments={assignments}
            loadAssignments={loadAssignments}
          />
        );
      case "tracker":
      default:
        return (
          <div className="container">
            <h1 className="title">Assignment Tracker</h1>
            <AddAssignment loadAssignments={loadAssignments} />
            <AssignmentList
              assignments={assignments}
              loadAssignments={loadAssignments}
            />
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
