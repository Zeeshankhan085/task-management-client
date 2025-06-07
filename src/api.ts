import axiosInstance from "./axios";
import { Board, EditColumn, NewBoard, NewTask, Task } from "./components/modal";

export async function fetchBoards() {
  const { data } = await axiosInstance.get("/boards");
  return data;
}

export async function updateBoard(
  boardId: string,
  board: Board & { deletedColumnIds?: string[] },
) {
  const { data } = await axiosInstance.put(`/boards/${boardId}/`, board);
  return data;
}

export const saveNewColumn = async ({
  boardId,
  columns,
  boardName,
}: {
  boardId: string;
  boardName: string;
  columns: EditColumn[];
}) => {
  const { data } = await axiosInstance.post(`/boards/${boardId}/columns/`, {
    columns,
    boardName,
  });
  return data;
};

export const moveTask = async ({
  boardId,
  sourceColumnId,
  targetColumnId,
  taskId,
}: {
  boardId: string;
  sourceColumnId: string;
  targetColumnId: string;
  taskId: string;
}) => {
  const { data } = await axiosInstance.put(
    `/boards/${boardId}/columns/${sourceColumnId}/tasks/${taskId}/move/`,
    { targetColumnId },
  );
  return data;
};

export const addNewBoard = async (board: NewBoard) => {
  const { data } = await axiosInstance.post("/boards", board);
  return data;
};

export const createTask = async ({
  boardId,
  columnId,
  task,
}: {
  boardId: string;
  columnId: string;
  task: NewTask;
}) => {
  const { data } = await axiosInstance.post(
    `/boards/${boardId}/columns/${columnId}/tasks`,
    { task },
  );
  return data;
};

export const deleteBoard = async (boardId: string) => {
  await axiosInstance.delete(`/boards/${boardId}`);
};

export const editTask = async ({
  boardId,
  columnId,
  taskId,
  deletedSubTaskIds,
  task,
}: {
  boardId: string;
  columnId: string;
  taskId: string;
  deletedSubTaskIds: string[];
  task: Omit<Task, "id">;
}) => {
  await axiosInstance.put(
    `/boards/${boardId}/columns/${columnId}/tasks/${taskId}/`,
    { deletedSubTaskIds, task },
  );
};

export const deleteTask = async ({
  boardId,
  columnId,
  taskId,
}: {
  boardId: string;
  columnId: string;
  taskId: string;
}) => {
  await axiosInstance.delete(
    `/boards/${boardId}/columns/${columnId}/tasks/${taskId}/`,
  );
};
