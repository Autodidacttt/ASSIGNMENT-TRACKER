import React, { useState } from "react";

function Calendar({ assignments }) {
  const today = new Date();
  const [current, setCurrent] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  const dueDates = assignments
    .filter((a) => a.date)
    .map((a) => {
      const d = a.date.toDate ? a.date.toDate() : new Date(a.date);
      return {
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        title: a.title,
        status: a.status,
      };
    });

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDay = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(current.month, current.year);
  const firstDay = getFirstDay(current.month, current.year);

  const prevMonth = () => {
    setCurrent((c) =>
      c.month === 0
        ? { month: 11, year: c.year - 1 }
        : { month: c.month - 1, year: c.year }
    );
  };

  const nextMonth = () => {
    setCurrent((c) =>
      c.month === 11
        ? { month: 0, year: c.year + 1 }
        : { month: c.month + 1, year: c.year }
    );
  };

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const getEventsForDay = (day) =>
    dueDates.filter(
      (d) =>
        d.day === day &&
        d.month === current.month &&
        d.year === current.year
    );

  const isToday = (day) =>
    day === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const [selected, setSelected] = useState(null);
  const selectedEvents = selected ? getEventsForDay(selected) : [];

  return (
    <div className="container">
      <h1 className="title">Calendar</h1>

      <div className="cal-card">
        {/* Header */}
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
          <span className="cal-month-label">
            {monthNames[current.month]} {current.year}
          </span>
          <button className="cal-nav-btn" onClick={nextMonth}>›</button>
        </div>

        {/* Day names */}
        <div className="cal-grid">
          {dayNames.map((d) => (
            <div className="cal-day-name" key={d}>{d}</div>
          ))}

          {/* Day cells */}
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const events = getEventsForDay(day);
            const hasEvent = events.length > 0;
            const hasPending = events.some((e) => e.status === "pending");
            const allDone = hasEvent && events.every((e) => e.status === "completed");
            return (
              <div
                key={day}
                className={[
                  "cal-day-cell",
                  isToday(day) ? "today" : "",
                  hasEvent ? (allDone ? "has-event done" : hasPending ? "has-event pending" : "") : "",
                  selected === day ? "selected" : "",
                ].join(" ")}
                onClick={() => setSelected(selected === day ? null : day)}
              >
                {day}
                {hasEvent && <span className="cal-dot" />}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="cal-legend">
          <span className="legend-item">
            <span className="legend-dot rose" />Pending due
          </span>
          <span className="legend-item">
            <span className="legend-dot green" />Completed
          </span>
          <span className="legend-item">
            <span className="legend-dot gold today-dot" />Today
          </span>
        </div>
      </div>

      {/* Selected day events */}
      {selected && (
        <div className="cal-events">
          <h2 className="section-heading">
            {monthNames[current.month]} {selected}
          </h2>
          {selectedEvents.length === 0 ? (
            <div className="empty-msg">No assignments due this day.</div>
          ) : (
            <div className="recent-list">
              {selectedEvents.map((e, i) => (
                <div className="recent-item" key={i}>
                  <span className="recent-title">{e.title}</span>
                  <span className={`badge ${e.status}`}>{e.status}</span>
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
