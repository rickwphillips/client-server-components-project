export type ToDo = {
  id: number;
  title: string;
  details: string | null;
  isImportant?: boolean;
  isComplete?: boolean;
  weight?: number;
  index?: number;
  created?: number;
}