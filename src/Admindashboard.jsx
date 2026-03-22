import React, { useState, useEffect } from "react";
import { assignmentAPI, userAPI } from "./api";

function AdminDashboard({ user, setUser }) {
  const [students, setStudents]         = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [activePage, setActivePage]     = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTitle, setAssignTitle]     = useState("");
  const [assignDueDate, setAssignDueDate] = useState("");
  const [assignSubject, setAssignSubject] = useState("");
  const [assignTarget, setAssignTarget]   = useState("all");
  const [saving, setSaving]               = useState(false);

  const loadData = async () => {
    try {
      const [{ users }, { assignments }] = await Promise.all([
        userAPI.getAll(),
        assignmentAPI.getAll(),
      ]);
      setStudents(users);
      setAllAssignments(assignments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const getStudentAssignments = (uid) =>
    allAssignments.filter((a) => {
      const id = a.userId?._id || a.userId;
      return id?.toString() === uid?.toString();
    });

  const totalCompleted = allAssignments.filter((a) => a.status === "completed").length;
  const totalPending   = allAssignments.filter((a) => a.status === "pending").length;
  const overallPercent = allAssignments.length === 0 ? 0
    : Math.round((totalCompleted / allAssignments.length) * 100);

  const handleAssign = async () => {
    if (!assignTitle.trim()) return;
    setSaving(true);
    try {
      if (assignTarget === "all") {
        await assignmentAPI.bulkCreate({
          title:   assignTitle.trim(),
          subject: assignSubject || null,
          dueDate: assignDueDate || null,
          userIds: students.map((s) => s._id),
        });
      } else {
        await assignmentAPI.create({
          title:   assignTitle.trim(),
          subject: assignSubject || null,
          dueDate: assignDueDate || null,
          userId:  assignTarget,
        });
      }
      setAssignTitle(""); setAssignDueDate("");
      setAssignSubject(""); setAssignTarget("all");
      setShowAssignModal(false);
      await loadData();
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const deleteAssignment = async (id) => {
    await assignmentAPI.remove(id);
    await loadData();
  };

  const toggleStatus = async (id, status) => {
    await assignmentAPI.update(id, {
      status: status === "completed" ? "pending" : "completed",
    });
    await loadData();
  };

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo">AT</div>
          <div className="admin-brand-label">Admin Panel</div>
        </div>

        <nav className="admin-nav">
          {[
            { key: "overview",    icon: "📊", label: "Overview"    },
            { key: "students",    icon: "🎓", label: "Students"    },
            { key: "assignments", icon: "📋", label: "Assignments" },
          ].map((p) => (
            <button
              key={p.key}
              className={`admin-nav-btn ${activePage === p.key ? "active" : ""}`}
              onClick={() => { setActivePage(p.key); setSelectedStudent(null); }}
            >
              <span>{p.icon}</span><span>{p.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">A</div>
            <div>
              <div className="admin-user-name">{user.name}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={() => setUser(null)}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">

        {/* OVERVIEW */}
        {activePage === "overview" && (
          <div className="admin-content">
            <div className="admin-page-header">
              <h1 className="admin-title">Overview</h1>
              <button className="admin-assign-btn" onClick={() => setShowAssignModal(true)}>
                + Assign Assignment
              </button>
            </div>

            <div className="admin-stats-grid">
              <div className="admin-stat-card"><div className="admin-stat-num rose">{students.length}</div><div className="admin-stat-label">Students</div></div>
              <div className="admin-stat-card"><div className="admin-stat-num gold">{allAssignments.length}</div><div className="admin-stat-label">Total Tasks</div></div>
              <div className="admin-stat-card"><div className="admin-stat-num green">{totalCompleted}</div><div className="admin-stat-label">Completed</div></div>
              <div className="admin-stat-card"><div className="admin-stat-num amber">{totalPending}</div><div className="admin-stat-label">Pending</div></div>
            </div>

            <div className="admin-card">
              <div className="progress-header">
                <span className="progress-label">Overall Completion</span>
                <span className="progress-percent">{overallPercent}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${overallPercent}%` }} />
              </div>
            </div>

            <div className="admin-card">
              <h2 className="admin-section-title">Student Progress</h2>
              {students.length === 0 ? (
                <div className="empty-msg">No students registered yet.</div>
              ) : students.map((s) => {
                const sa   = getStudentAssignments(s._id);
                const done = sa.filter((a) => a.status === "completed").length;
                const pct  = sa.length === 0 ? 0 : Math.round((done / sa.length) * 100);
                return (
                  <div key={s._id} className="admin-student-row">
                    <div className="admin-student-avatar">{(s.name || "S")[0].toUpperCase()}</div>
                    <div className="admin-student-info">
                      <div className="admin-student-name">{s.name}</div>
                      <div className="admin-student-email">{s.email}</div>
                    </div>
                    <div className="admin-student-progress">
                      <div className="progress-track" style={{ width: "120px" }}>
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="admin-pct-label">{pct}%</span>
                    </div>
                    <div className="admin-student-counts">
                      <span className="badge completed">{done} done</span>
                      <span className="badge pending">{sa.length - done} left</span>
                    </div>
                    <button className="admin-view-btn"
                      onClick={() => { setSelectedStudent(s); setActivePage("students"); }}>
                      View →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STUDENTS */}
        {activePage === "students" && (
          <div className="admin-content">
            <div className="admin-page-header">
              <h1 className="admin-title">
                {selectedStudent ? `${selectedStudent.name}'s Assignments` : "Students"}
              </h1>
              {selectedStudent ? (
                <button className="admin-back-btn" onClick={() => setSelectedStudent(null)}>← Back</button>
              ) : (
                <button className="admin-assign-btn" onClick={() => setShowAssignModal(true)}>+ Assign</button>
              )}
            </div>

            {!selectedStudent ? (
              <div className="admin-students-grid">
                {students.length === 0 ? (
                  <div className="empty-msg">No students yet.</div>
                ) : students.map((s) => {
                  const sa   = getStudentAssignments(s._id);
                  const done = sa.filter((a) => a.status === "completed").length;
                  const pct  = sa.length === 0 ? 0 : Math.round((done / sa.length) * 100);
                  return (
                    <div key={s._id} className="admin-student-card" onClick={() => setSelectedStudent(s)}>
                      <div className="admin-student-avatar lg">{(s.name || "S")[0].toUpperCase()}</div>
                      <div className="admin-student-name">{s.name}</div>
                      <div className="admin-student-email">{s.email}</div>
                      <div className="admin-stat-row">
                        <span className="admin-mini-stat rose">{sa.length} tasks</span>
                        <span className="admin-mini-stat green">{done} done</span>
                      </div>
                      <div className="progress-track" style={{ width: "100%", marginTop: "0.5rem" }}>
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="admin-pct-label" style={{ textAlign: "center", marginTop: "4px" }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <button className="admin-assign-btn" style={{ marginBottom: "1.2rem" }}
                  onClick={() => { setAssignTarget(selectedStudent._id); setShowAssignModal(true); }}>
                  + Assign to {selectedStudent.name}
                </button>
                {getStudentAssignments(selectedStudent._id).length === 0 ? (
                  <div className="empty-msg">No assignments for this student yet.</div>
                ) : getStudentAssignments(selectedStudent._id).map((a) => (
                  <div key={a._id} className="assignment">
                    <div>
                      <div className="assignmentTitle">{a.title}</div>
                      {a.subject && <div className="admin-subject-tag">{a.subject}</div>}
                      {a.dueDate && (
                        <div className="admin-due-label">
                          Due: {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      )}
                      <span className={a.status}>{a.status}</span>
                    </div>
                    <div className="buttons">
                      <button className="completeBtn" onClick={() => toggleStatus(a._id, a.status)}>✔</button>
                      <button className="deleteBtn"   onClick={() => deleteAssignment(a._id)}>✖</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ALL ASSIGNMENTS */}
        {activePage === "assignments" && (
          <div className="admin-content">
            <div className="admin-page-header">
              <h1 className="admin-title">All Assignments</h1>
              <button className="admin-assign-btn" onClick={() => setShowAssignModal(true)}>+ Assign</button>
            </div>
            {allAssignments.length === 0 ? (
              <div className="empty-msg">No assignments yet.</div>
            ) : allAssignments.map((a) => {
              const studentName = a.userId?.name || students.find((s) => s._id === a.userId)?.name;
              return (
                <div key={a._id} className="assignment">
                  <div style={{ flex: 1 }}>
                    <div className="assignmentTitle">{a.title}</div>
                    <div className="admin-meta-row">
                      {studentName && <span className="admin-student-tag">🎓 {studentName}</span>}
                      {a.subject   && <span className="admin-subject-tag">{a.subject}</span>}
                      {a.dueDate   && <span className="admin-due-label">📅 {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
                    </div>
                    <span className={a.status}>{a.status}</span>
                  </div>
                  <div className="buttons">
                    <button className="completeBtn" onClick={() => toggleStatus(a._id, a.status)}>✔</button>
                    <button className="deleteBtn"   onClick={() => deleteAssignment(a._id)}>✖</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ASSIGN MODAL */}
      {showAssignModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-section-title" style={{ marginBottom: 0 }}>Assign Assignment</h2>
              <button className="cal-modal-close" onClick={() => setShowAssignModal(false)}>✕</button>
            </div>
            <input className="cal-modal-input" placeholder="Assignment title *" value={assignTitle} onChange={(e) => setAssignTitle(e.target.value)} />
            <input className="cal-modal-input" placeholder="Subject (optional)"  value={assignSubject} onChange={(e) => setAssignSubject(e.target.value)} />
            <div className="admin-modal-label">Due Date (optional)</div>
            <input className="cal-modal-input" type="date" value={assignDueDate} onChange={(e) => setAssignDueDate(e.target.value)} />
            <div className="admin-modal-label">Assign To</div>
            <select className="cal-modal-select" value={assignTarget} onChange={(e) => setAssignTarget(e.target.value)}>
              <option value="all">All Students</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
              ))}
            </select>
            <button className="cal-modal-save" onClick={handleAssign} disabled={saving}>
              {saving ? "Assigning..." : assignTarget === "all" ? `Assign to All ${students.length} Students` : "Assign to Student"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
