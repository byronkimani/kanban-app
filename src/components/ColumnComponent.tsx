import { useSortable } from "@dnd-kit/sortable";
import DeleteIcon from "../icons/DeleteIcon";
import { Column, Id } from "../models";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
}

function ColumnComponent(props: Props) {
  const { column, deleteColumn, updateColumn } = props;
  const [editMode, setEditMode] = useState(false);

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

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        className="
    bg-columnBackgroundColor
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    opacity-70
    border-rose-500
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
    w-[350px]
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
       border-columnBackgroundColor
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
          <div
            className="
        flex
        justify-center
        items-center
        bg-columnBackgroundColor
        px-2
        py-1
        text-sm
        rounded-full
        "
          >
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              autoFocus
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
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
        hover:stroke-white
        hover: bg-columnBackgroundColor
        rounded
        px-1
        py-2
        "
        >
          <DeleteIcon></DeleteIcon>
        </button>
      </div>

      {/* content */}
      <div className="flex flex-grow">Content</div>
      {/* footer */}
      <button className="border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor"
      onClick={() => createTask(column.id)}
      >
        Add Task
      </button>
    </div>
  );
}

export default ColumnComponent;
