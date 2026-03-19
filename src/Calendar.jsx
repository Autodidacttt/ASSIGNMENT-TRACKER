import React, { useState } from "react";
import { assignmentAPI } from "./api";

function Calendar({ assignments, loadAssignments, userId }) {
  const today = new Date();
  const [current, setCurrent]             = useState({ month: today.getMonth(), year: today.getFullYear() });
  const [selected, setSelected]           = useState(null);
  const [showModal, setShowModal]         = useState(false);
  const [modalMode, setModalMode]         = useState("new");
  const [newTitle, setNewTitle]           = useState("");
  const [selectedAssId, setSelectedAssId] = useState("");
  const [saving, setSaving]               = useState(false);

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay    = (m, y) => new Date(y, m, 1).getDay();

  const prevMonth = () => setCurrent((c) => c.month === 0  ? { month: 11, year: c.year - 1 } : { month: c.month - 1, year: c.year });
  const nextMonth = () => setCurrent((c) => c.month === 11 ? { month: 0,  year: c.year + 1 } : { month: c.month + 1, year: c.year });
  const isToday   = (d) => d === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();

  const dueDates = assignments.filter((a) => a.dueDate).map((a) => {
    const d = new Date(a.dueDate);
    return { day: d.getDate(), month: d.getMonth(), year: d.getFullYear(), ...a };
  });

  const getEventsForDay = (day) =>
    dueDates.filter((d) => d.day === day && d.month === current.month && d.year === current.year);

  const cells = [];
  for (let i = 0; i < getFirstDay(current.month, current.year); i++) cells.push(null);
  for (let d = 1; d <= getDaysInMonth(current.month, current.year); d++) cells.push(d);

  const selectedEvents = selected ? getEventsForDay(selected) : [];
  const unscheduled    = assignments.filter((a) => !a.dueDate);

  const openSchedule = (day, e) => {
    e.stopPropagation();
    setSelected(day); setShowModal(true);
    setNewTitle(""); setSelectedAssId(""); setModalMode("new");
  };

  const scheduleDueDate = async () => {
    if (!selected) return;
    setSaving(true);
    const dueDate = new Date(current.year, current.month, selected, 23, 59, 0).toISOString();
    try {
      if (modalMode === "new") {
        if (!newTitle.trim()) { setSaving(false); return; }
        await assignmentAPI.create({ title: newTitle.trim(), dueDate, userId });
      } else {
        if (!selectedAssId) { setSaving(false); return; }
        await assignmentAPI.update(selectedAssId, { dueDate });
      }
      await loadAssignments();
      setShowModal(false); setNewTitle(""); setSelectedAssId("");
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const removeDueDate = async (id) => {
    await assignmentAPI.update(id, { dueDate: null });
    await loadAssignments();
  };

  return (
    <div className="container">
      <h1 className="title">Calendar</h1>

      <div className="cal-card">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
          <span className="cal-month-label">{monthNames[current.month]} {current.year}</span>
          <button className="cal-nav-btn" onClick={nextMonth}>›</button>
        </div>

        <div className="cal-grid">
          {dayNames.map((d) => <div className="cal-day-name" key={d}>{d}</div>)}
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />;
            const events     = getEventsForDay(day);
            const hasEvent   = events.length > 0;
            const hasPending = events.some((e) => e.status === "pending");
            const allDone    = hasEvent && events.every((e) => e.status === "completed");
            return (
              <div key={day}
                className={["cal-day-cell", isToday(day) ? "today" : "",
                  hasEvent ? (allDone ? "has-event done" : hasPending ? "has-event pending" : "") : "",
                  selected === day ? "selected" : ""].join(" ")}
                onClick={() => { setSelected(selected === day ? null : day); setShowModal(false); }}
              >
                {day}
                {hasEvent && <span className="cal-dot" />}
                <span className="cal-add-btn" onClick={(e) => openSchedule(day, e)}>+</span>
              </div>
            );
          })}
        </div>

        <div className="cal-legend">
          <span className="legend-item"><span className="legend-dot rose" />Due (pending)</span>
          <span className="legend-item"><span className="legend-dot green" />Completed</span>
          <span className="legend-item"><span className="legend-dot gold" />Today</span>
        </div>
      </div>

      {showModal && selected && (
        <div className="cal-modal">
          <div className="cal-modal-header">
            <h2 className="section-heading" style={{ marginBottom: 0 }}>Schedule — {monthNames[current.month]} {selected}</h2>
            <button className="cal-modal-close" onClick={() => setShowModal(false)}>✕</button>
          </div>
          <div className="cal-modal-tabs">
            <button className={`cal-tab-btn ${modalMode === "new" ? "active" : ""}`} onClick={() => setModalMode("new")}>+ New</button>
            <button className={`cal-tab-btn ${modalMode === "existing" ? "active" : ""}`} onClick={() => setModalMode("existing")}>Assign Existing</button>
          </div>
          <div className="cal-modal-body">
            {modalMode === "new" ? (
              <input className="cal-modal-input" placeholder="Assignment title..." value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && scheduleDueDate()} autoFocus />
            ) : unscheduled.length === 0 ? (
              <div className="empty-msg">All assignments already have a due date.</div>
            ) : (
              <select className="cal-modal-select" value={selectedAssId} onChange={(e) => setSelectedAssId(e.target.value)}>
                <option value="">— Select assignment —</option>
                {unscheduled.map((a) => <option key={a._id} value={a._id}>{a.title}</option>)}
              </select>
            )}
          </div>
          <button className="cal-modal-save" onClick={scheduleDueDate} disabled={saving}>
            {saving ? "Saving..." : `Set Due Date → ${monthNames[current.month]} ${selected}`}
          </button>
        </div>
      )}

      {selected && !showModal && (
        <div className="cal-events">
          <div className="cal-events-header">
            <h2 className="section-heading" style={{ marginBottom: 0 }}>{monthNames[current.month]} {selected}</h2>
            <button className="cal-schedule-btn" onClick={(e) => openSchedule(selected, e)}>+ Schedule</button>
          </div>
          {selectedEvents.length === 0 ? (
            <div className="empty-msg">No assignments due. Click + Schedule to add one.</div>
          ) : (
            <div className="recent-list">
              {selectedEvents.map((e) => (
                <div className="recent-item" key={e._id}>
                  <span className="recent-title">{e.title}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className={`badge ${e.status}`}>{e.status}</span>
                    <button className="cal-remove-due" onClick={() => removeDueDate(e._id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Calendar;
