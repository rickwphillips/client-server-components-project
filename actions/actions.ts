"use server"

import prisma from "@/lib/db";

import { revalidatePath } from "next/cache";
import { ToDo } from "@/app/components/types";

export async function addToDo(formData: FormData) {
  await prisma.toDo.create({
    data: {
      title: formData.get("title")?.toString() ?? 'No Title'
    },
  });
  revalidatePath("/");
}

export async function removeToDo(id: number) {
  await prisma.toDo.delete({
    where: {
      id: id,
    },
  });
  revalidatePath("/");
}

export async function updateToDo(toDo: ToDo) {
  const { id, index, ...toDoData } = toDo;

  await prisma.toDo.update({
    where: {
      id: id,
    },
    data: {
      ...toDoData,
    },
  });
  revalidatePath("/");
}

export async function updateToDos(toDos: ToDo[]) {
  toDos.forEach(async (toDo) => {
    const { id, index, ...toDoData } = toDo;

    await prisma.toDo.update({
      where: {
        id: id,
      },
      data: {
        ...toDoData,
      },
    });
  });
  //revalidatePath("/");
}
