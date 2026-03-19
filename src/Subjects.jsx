import React, { useState } from "react";
import { assignmentAPI } from "./api";

const SUBJECT_COLORS = [
  "#c9837a", "#c9a96e", "#8fbfa0", "#a09abf",
  "#7aaabf", "#bf9a7a", "#bf7a9a", "#7abf9a",
];

function Subjects({ assignments, loadAssignments, userId }) {
  const [subjects, setSubjects] = useState([
    { name: "Mathematics", color: SUBJECT_COLORS[0] },
    { name: "Science",     color: SUBJECT_COLORS[1] },
    { name: "English",     color: SUBJECT_COLORS[2] },
    { name: "History",     color: SUBJECT_COLORS[3] },
  ]);
  const [newSubject, setNewSubject]     = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newTitle, setNewTitle]         = useState("");

  const addSubject = () => {
    if (!newSubject.trim()) return;
    const color = SUBJECT_COLORS[subjects.length % SUBJECT_COLORS.length];
    setSubjects([...subjects, { name: newSubject.trim(), color }]);
    setNewSubject("");
  };

  const removeSubject = (name) => {
    setSubjects(subjects.filter((s) => s.name !== name));
    if (selectedSubject === name) setSelectedSubject(null);
  };

  const addAssignmentToSubject = async () => {
    if (!newTitle.trim() || !selectedSubject) return;
    await assignmentAPI.create({
      title: newTitle.trim(),
      subject: selectedSubject,
      userId,
    });
    setNewTitle("");
    loadAssignments();
  };

  const toggleStatus = async (id, status) => {
    await assignmentAPI.update(id, {
      status: status === "completed" ? "pending" : "completed",
    });
    loadAssignments();
  };

  const deleteAssignment = async (id) => {
    await assignmentAPI.remove(id);
    loadAssignments();
  };

  const getSubjectAssignments = (name) =>
    assignments.filter((a) => a.subject === name);

  return (
    <div className="container">
      <h1 className="title">Subjects</h1>

      <div className="inputBox">
        <input
          placeholder="Add new subject..."
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSubject()}
        />
        <button onClick={addSubject}>Add</button>
      </div>

      <div className="subjects-list">
        {subjects.map((s) => {
          const subAssignments = getSubjectAssignments(s.name);
          const done   = subAssignments.filter((a) => a.status === "completed").length;
          const isOpen = selectedSubject === s.name;

          return (
            <div key={s.name} className="subject-block">
              <div
                className="subject-header"
                style={{ borderLeftColor: s.color }}
                onClick={() => setSelectedSubject(isOpen ? null : s.name)}
              >
                <div className="subject-header-left">
                  <span className="subject-color-dot" style={{ background: s.color }} />
                  <span className="subject-title">{s.name}</span>
                </div>
                <div className="subject-header-right">
                  <span className="subject-count">{done}/{subAssignments.length} done</span>
                  <span className="subject-chevron">{isOpen ? "▲" : "▼"}</span>
                  <button
                    className="subject-delete-btn"
                    onClick={(e) => { e.stopPropagation(); removeSubject(s.name); }}
                  >✖</button>
                </div>
              </div>

              {isOpen && (
                <div className="subject-body">
                  <div className="subject-add">
                    <input
                      placeholder={`Add to ${s.name}...`}
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addAssignmentToSubject()}
                    />
                    <button onClick={addAssignmentToSubject}>Add</button>
                  </div>
                  {subAssignments.length === 0 ? (
                    <div className="empty-msg">No assignments yet.</div>
                  ) : subAssignments.map((a) => (
                    <div className="subject-assignment" key={a._id}>
                      <div>
                        <div className="assignmentTitle">{a.title}</div>
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
          );
        })}
      </div>

      {/* Unassigned */}
      <div className="dashboard-section">
        <h2 className="section-heading">Unassigned</h2>
        {assignments.filter((a) => !a.subject).length === 0 ? (
          <div className="empty-msg">All assignments are categorised.</div>
        ) : assignments.filter((a) => !a.subject).map((a) => (
          <div className="recent-item" key={a._id}>
            <span className="recent-title">{a.title}</span>
            <span className={`badge ${a.status}`}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subjects;
