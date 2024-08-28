import { useState } from "react";
import DeleteIcon from "../icons/DeleteIcon";
import { Id, Task } from "../models";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  updateTask: (id: Id, description: string) => void;
  deleteTask: (id: Id) => void;
}

function TaskCard(props: Props) {
  const { task, updateTask, deleteTask } = props;
  const [mouseIsOver, setMouseIsOver] = useState(true);
  const [editMode, setEditMode] = useState(false);
  // hook from dnd that allows drag on drop of columns
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setMouseIsOver(false);
  };
  //Provide an overlay when dragging the card
  if (isDragging) {
    <div
      ref={setNodeRef}
      style={style}
      className="
 bg-mainBackgroundColor
  p-2.5
  h-[100px]
  min-h-[100px]
  items-center
  flex
  text-left
  rounded-xl
  cursor-grab
  relative
  opacity-30
    "
    ></div>;
  }

  // if editing the description
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="
bg-mainBackgroundColor
p-2.5
h-[100px]
min-h-[100px]
items-center
flex
text-left
text-slate-800
rounded-xl
hover:ring-inset
hover:ring-2
cursor-grab
relative
"
      >
        <textarea
          className="
        h-[80%]
        w-[70%]
        resize-none
        border-none
        rounded
        text-slate-600
        focus:outline-none
        "
          value={task.description}
          autoFocus
          onBlur={toggleEditMode}
          placeholder="Enter task description here "
          onKeyDown={(e) => {
            if (e.key === "Enter") toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
      </div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
  bg-mainBackgroundColor
  p-2.5
  h-[100px]
  min-h-[100px]
  items-center
  flex
  text-left
  rounded-xl
  hover:ring-inset
  hover:ring-2
  cursor-grab
  relative
  "
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={toggleEditMode}
    >
      <p className="overflow-x-hidden"> {task.description}</p>

      {mouseIsOver && (
        <button
          className="
       stroke-black
       absolute
       right-4
       top-1/2
       -translate-y-1/2
       bg-columnBackgroundColor
       p-2
       rounded
       opacity-60
       hover:opacity-100
       "
          onClick={() => deleteTask(task.id)}
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
}

export default TaskCard;
