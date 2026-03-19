import React from "react";
import { assignmentAPI } from "./api";

function AssignmentList({ assignments, loadAssignments }) {
  const deleteAssignment = async (id) => {
    await assignmentAPI.remove(id);
    loadAssignments();
  };

  const completeAssignment = async (id) => {
    await assignmentAPI.update(id, { status: "completed" });
    loadAssignments();
  };

  return (
    <div>
      {assignments.map((a) => (
        <div className="assignment" key={a._id}>
          <div>
            <div className="assignmentTitle">{a.title}</div>
            <div className={a.status === "completed" ? "completed" : "pending"}>
              {a.status}
            </div>
          </div>
          <div className="buttons">
            <button className="completeBtn" onClick={() => completeAssignment(a._id)}>✔</button>
            <button className="deleteBtn"   onClick={() => deleteAssignment(a._id)}>✖</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AssignmentList;
