import React, { useMemo, useState } from "react";
import { Column, Id , Task} from "../models";
import { v4 as uuidv4 } from "uuid";
import ColumnComponent from "./ColumnComponent";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function KanbanBoard() {

  const [columns, setColumns] = useState<Column[]>([]);
  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const sensor = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  console.log(columns);
  return (
    <div
      className="
    m-auto
    flex
    min-h-screen
    w-full
    items-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
    "
    >
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensor}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnIds}>
              {columns.map((col) => (
                <ColumnComponent
                  key={col.id}
                  column={col}
                  updateColumn={ () => updateColumn}
                  deleteColumn={() => {
                    deleteColumn(col.id);
                  }}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createColumn();
            }}
            className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      rounded-lg
      bg-mainBackgroundColor
      border-2
      border-columnBackgroundColor
      p-4
      ring-rose-500
      hover:ring-2
      "
          >
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnComponent
                column={activeColumn}
                updateColumn={updateColumn}
                deleteColumn={deleteColumn}
              ></ColumnComponent>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createColumn() {
    const columnToAdd: Column = {
      id: uuidv4(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function updateColumn(id: Id, title: string) {
    const updatedColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(updatedColumns);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );

      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }
}

export default KanbanBoard;
