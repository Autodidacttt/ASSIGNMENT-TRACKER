import React from "react";

function Profile({ setLoggedIn, assignments }) {
  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === "completed").length;
  const pending = assignments.filter((a) => a.status === "pending").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <div className="container">
      <h1 className="title">Profile</h1>

      {/* Avatar */}
      <div className="profile-card">
        <div className="profile-avatar">S</div>
        <div className="profile-name">Student</div>
        <div className="profile-role">student@school.com</div>

        {/* Info rows */}
        <div className="profile-info">
          <div className="profile-row">
            <span className="profile-key">Username</span>
            <span className="profile-val">student</span>
          </div>
          <div className="profile-row">
            <span className="profile-key">Password</span>
            <span className="profile-val">••••</span>
          </div>
          <div className="profile-row">
            <span className="profile-key">Joined</span>
            <span className="profile-val">
              {new Date().toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Mini stats */}
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="stat-number rose">{total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="profile-stat">
            <div className="stat-number green">{completed}</div>
            <div className="stat-label">Done</div>
          </div>
          <div className="profile-stat">
            <div className="stat-number gold">{pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-section" style={{ width: "100%" }}>
          <div className="progress-header">
            <span className="progress-label">Completion Rate</span>
            <span className="progress-percent">{percent}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>

        {/* Logout */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
