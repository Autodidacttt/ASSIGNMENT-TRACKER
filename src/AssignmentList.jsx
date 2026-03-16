import React from "react";
import { db } from "./firebase";
import { deleteDoc,doc,updateDoc } from "firebase/firestore";

function AssignmentList({assignments,loadAssignments}){

const deleteAssignment = async (id)=>{

await deleteDoc(doc(db,"assignments",id));
loadAssignments();

};

const completeAssignment = async (id)=>{

await updateDoc(doc(db,"assignments",id),{
status:"completed"
});

loadAssignments();

};

return(

<div>

{assignments.map((a)=>(

<div className="assignment" key={a.id}>

<div>

<div className="assignmentTitle">{a.title}</div>

<div className={
a.status==="completed"
? "completed"
: "pending"
}>
{a.status}
</div>

</div>

<div className="buttons">

<button
className="completeBtn"
onClick={()=>completeAssignment(a.id)}
>
✔
</button>

<button
className="deleteBtn"
onClick={()=>deleteAssignment(a.id)}
>
✖
</button>

</div>

</div>

))}

</div>

);

}

export default AssignmentList;