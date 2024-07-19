"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import { ToDoItem } from "./ToDoItem";
import { ToDo } from "@/app/components/types";
import update from 'immutability-helper'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function ToDoList({ 
  toDos 
}: { 
  toDos: ToDo[] 
}) {

  const [orderedToDos, setOrderedToDos] = useState<ToDo[]>(toDos);

  useMemo(() => {
    toDos = toDos.map((toDo, index) => ({...toDo, index: toDo.index ?? index - 1}));
    setOrderedToDos(toDos);
  }, [toDos]);


  const moveCard = useCallback( 
    (dragIndex: number, hoverIndex: number) => {
      setOrderedToDos((prevToDos: ToDo[]) => {
        return update(prevToDos, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevToDos[dragIndex] as ToDo],
          ],
        });
    });
  }, []);


  const renderToDo = useCallback(
    (toDo: ToDo, index: number) => 
      <ToDoItem key={toDo.id} toDo={toDo} index={index} moveCard={moveCard} />
    , []);

    return (
      <>
        <div className="flex w-100 justify-center italic m-2">{toDos.length} Task(s)</div>
        <DndProvider backend={HTML5Backend}>
          <ul className="mt-2 pl-0">
            { orderedToDos.map( (toDo, index) => renderToDo(toDo, index) ) }
          </ul>
        </DndProvider>
      </>
    );
}
