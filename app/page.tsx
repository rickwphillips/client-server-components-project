import prisma from "../lib/db";
import AddToDoForm from "./components/AddToDoForm";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-icons/iconfont/material-icons.css';
import { ToDoList } from "./components/ToDoList";

export default async function Home() {
  const toDos = await prisma.toDo.findMany({ orderBy: [{ weight: 'asc' }, { created: 'desc'}]});

  return (
    <main className="container max-w-lg">
        <div className="max-w-96">
          <h2>To Dos</h2>
          <AddToDoForm />
          <ToDoList toDos={toDos} />
        </div>
    </main>
  );
}
