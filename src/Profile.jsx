import React from "react";

function Profile({ assignments, user, setUser }) {
  const total     = assignments.length;
  const completed = assignments.filter((a) => a.status === "completed").length;
  const pending   = assignments.filter((a) => a.status === "pending").length;
  const percent   = total === 0 ? 0 : Math.round((completed / total) * 100);
  const initials  = (user?.name || "S").slice(0, 2).toUpperCase();

  return (
    <div className="container">
      <h1 className="title">Profile</h1>

      <div className="profile-card">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-name">{user?.name || "Student"}</div>
        <div className="profile-role">{user?.email}</div>

        <div className="profile-info">
          <div className="profile-row">
            <span className="profile-key">Name</span>
            <span className="profile-val">{user?.name}</span>
          </div>
          <div className="profile-row">
            <span className="profile-key">Email</span>
            <span className="profile-val">{user?.email}</span>
          </div>
          <div className="profile-row">
            <span className="profile-key">Role</span>
            <span className="profile-val" style={{ textTransform: "capitalize" }}>{user?.role}</span>
          </div>
          <div className="profile-row">
            <span className="profile-key">Joined</span>
            <span className="profile-val">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                : "—"}
            </span>
          </div>
        </div>

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

        <div className="progress-section" style={{ width: "100%" }}>
          <div className="progress-header">
            <span className="progress-label">Completion Rate</span>
            <span className="progress-percent">{percent}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <button className="logout-btn" onClick={() => setUser(null)}>Logout</button>
      </div>
    </div>
  );
}

export default Profile;
