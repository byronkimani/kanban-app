import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column, Id, Task } from "../models";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import DeleteIcon from "../icons/DeleteIcon";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, description: string) => void;
  deleteTask: (id: Id) => void;
  clearColumn: (id: Id) => void;
  tasks: Task[];
}

function ColumnComponent(props: Props) {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    updateTask,
    clearColumn,
    deleteTask,
  } = props;
  const [editMode, setEditMode] = useState(false);
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  // hook from dnd that allows drag on drop of columns
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  // CSS style for the dragging animation
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        className="
    bg-columnBackgroundColor
    w-[250px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    opacity-70
    "
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
    bg-columnBackgroundColor
    w-[250px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    "
    >
      {/* title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="
      bg-mainBackgroundColor
       text-md h-[60px]
       cursor-grab rounded-md
       rounded-b-none
       p-3
       font-bold
       border-4
       flex
       items-center
       justify-between
      "
      >
        <div
          className="
        flex
        gap-4
        "
        >
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-white border rounded outline-none px-2 w-[80%]"
              autoFocus
              value={column.title}
              onChange={(e) => {
                updateColumn(column.id, e.target.value);
              }}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            ></input>
          )}
        </div>

        <button
          onClick={() => deleteColumn(column.id)}
          className="
        stroke-gray-500
        rounded
        px-1
        py-2
        "
        >
          <DeleteIcon></DeleteIcon>
        </button>
      </div>

      {/* content */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            ></TaskCard>
          ))}
        </SortableContext>
      </div>
      {/* footer */}
      <button
        className="bg-mainBackgroundColor m-2 mb-0 p-2 rounded-lg flex-row"
        onClick={() => createTask(column.id)}
      >
        Add Task
      </button>
      <button
        className="bg-mainBackgroundColor m-2 p-2 rounded-lg flex-row text-red-500"
        onClick={() => clearColumn(column.id)}
      >
        Clear Column
      </button>
    </div>
  );
}

export default ColumnComponent;
