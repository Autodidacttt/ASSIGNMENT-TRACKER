import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

function AddAssignment({ loadAssignments, userId }) {
  const [title, setTitle] = useState("");

  const addAssignment = async () => {
    if (title === "") return;
    await addDoc(collection(db, "assignments"), {
      title: title,
      status: "pending",
      date: new Date(),
      userId: userId || null,
    });
    setTitle("");
    loadAssignments();
  };

  return (
    <div className="inputBox">
      <input
        placeholder="Enter assignment"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addAssignment()}
      />
      <button onClick={addAssignment}>Add</button>
    </div>
  );
}

export default AddAssignment;
