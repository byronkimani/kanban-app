import { useMemo, useState } from "react";
import { Column, Id, Task } from "../models";
import { v4 as uuidv4 } from "uuid";
import ColumnComponent from "./ColumnComponent";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard() {
  // hooks to manage the state of the kanban board
  const [columns, setColumns] = useState<Column[]>([]);
  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // sensor to prevent accidental activation
  const sensor = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div
      className="
    m-auto
    min-h-screen
    w-full
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
    "
    >
      <h1 className="mt-[30px] text-accentColor text-2xl	font-bold	">Kanban</h1>
      <p className="mb-[20px]"> Manage your tasks like a pro</p>

      <DndContext
        // listeners for the dragging
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        sensors={sensor}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnIds}>
              {columns.map((col) => (
                <ColumnComponent
                  key={col.id}
                  column={col}
                  updateColumn={() => updateColumn}
                  deleteColumn={() => {
                    deleteColumn(col.id);
                  }}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createColumn();
            }}
            className="
      h-[40px]
      w-[200px]
      rounded-lg
      bg-accentColor
      border-2
      text-white
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
                createTask={createTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteTask={deleteTask}
                updateTask={updateTask}
              ></ColumnComponent>
            )}
            {activeTask && (
              <TaskCard
                key={activeTask.id}
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              ></TaskCard>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
  // create a new column
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
    // remove the tasks associated to  the column to be deleted
    const filteredTasks = tasks.filter((t) => t.columnId !== id);
    setColumns(filteredColumns);
    setTasks(filteredTasks);
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: uuidv4(),
      columnId: columnId,
      description: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }

  function updateTask(id: Id, description: string) {
    const updateTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, description };
    });
    setTasks(updateTasks);
  }

  function deleteTask(id: Id) {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;
    // get the ids of the 2 columns that are being dragged;
    // the one being dragged
    // the one being dragged over
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
    //logic to re-order the columns
    setColumns((columns) => {
      const activeIndex = columns.findIndex((col) => col.id === activeId);

      const overIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeIndex, overIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    // get the ids of the 2 columns that are being dragged;
    // the one being dragged
    // the one being dragged over
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    // dropping a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);

        const overIndex = tasks.findIndex((task) => task.id === overId);

        // dropping a task into another column
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          // update column id to shift the task to the new column
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverColumn = over.data.current?.type === "Column";

    // dropping a task over another column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

export default KanbanBoard;
