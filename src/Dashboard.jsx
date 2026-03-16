import React from "react";

function Dashboard({ assignments }) {
  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === "completed").length;
  const pending = assignments.filter((a) => a.status === "pending").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const recentCompleted = assignments
    .filter((a) => a.status === "completed")
    .slice(-3)
    .reverse();

  return (
    <div className="container">
      <h1 className="title">Dashboard</h1>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number rose">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-number gold">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number green">{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Overall Progress</span>
          <span className="progress-percent">{percent}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="progress-sub">
          {completed} of {total} assignments completed
        </div>
      </div>

      {/* Recently Completed */}
      <div className="dashboard-section">
        <h2 className="section-heading">Recently Completed</h2>
        {recentCompleted.length === 0 ? (
          <div className="empty-msg">No completed assignments yet.</div>
        ) : (
          <div className="recent-list">
            {recentCompleted.map((a) => (
              <div className="recent-item" key={a.id}>
                <span className="recent-title">{a.title}</span>
                <span className="badge completed">Completed</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Motivational */}
      <div className="motivation-card">
        {percent === 100
          ? "🎉 All done! Outstanding work."
          : percent >= 50
          ? "✨ More than halfway there — keep going!"
          : "📚 Stay focused, you've got this."}
      </div>
    </div>
  );
}

export default Dashboard;
