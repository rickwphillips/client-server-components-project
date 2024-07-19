"use client"

import { removeToDo, updateToDo } from "@/actions/actions";
import { Checkbox } from '@mui/material';
import { ToDo } from "@/app/components/types";
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from 'react-dnd'

export function ToDoItem({ 
  toDo, index, moveCard 
}: { 
  toDo: ToDo, index: number, moveCard: (dragIndex: number, hoverIndex: number) => void }) 
  {

  const ref = useRef(null);

  useEffect(() => { 
    if (toDo.weight !== index) {
      debugger;
      toDo.weight = index;
      updateToDo(toDo);
    } 
  }, [index]);

  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {

      if (!ref.current) {
        return
      }
      const dragIndex = (item as ToDo).index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = (ref.current as HTMLElement).getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (typeof dragIndex === "undefined") return;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      (item as ToDo).index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      const id = toDo.id; // Declare or initialize the 'id' variable
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const toggleComplete = () => {
    updateToDo({
      ...toDo,
      isComplete: !toDo.isComplete,
    });
  }
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  const completedStyle = toDo.isComplete ? "line-through" : "none";

  return  (
    <li key={toDo.id}
        ref={ref} 
        className="flex justify-between items-center odd:bg-white even:bg-slate-200">
      <div>
        <Checkbox checked={toDo.isComplete} onClick={toggleComplete} />
      <span className={completedStyle}>{toDo.title}</span>
      </div>
      <span
        className="material-icons-two-tone cursor-pointer"
        title="Remove To Do"
        onClick={() => removeToDo(toDo.id)}>
          remove_circle
      </span>
    </li>
  )
}