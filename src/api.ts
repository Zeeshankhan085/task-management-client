import axiosInstance from "./axios";
import { EditColumn, NewBoard, NewTask, Task } from "./components/modal";

export async function fetchBoards() {
  const { data } = await axiosInstance.get('/boards');
  return data;
}

export const saveNewColumn = async ({boardId, columns, boardName}: {boardId: string, boardName: string, columns:EditColumn[]}) => {
 const {data} = await  axiosInstance.post(`/boards/${boardId}/columns`, { columns, boardName });
 return data
 
}

export const moveTask = async ({boardId, sourceColumnId, targetColumnId, taskId}: {boardId: string, sourceColumnId: string, targetColumnId: string, taskId: number}) => {
  const {data} = await  axiosInstance.put(`tasks/${taskId}/move`, { targetColumnId, sourceColumnId, boardId });
  return data
 }

 export const addNewBoard = async(board: NewBoard) => {
  const {data} = await axiosInstance.post('/boards',board);
  return data
 }

 export const createTask = async ({columnId, task}: { columnId: string, task: NewTask}) => {
  const {data} = await axiosInstance.post(`/tasks`, {task, columnId});
  return data
 }

 export const deleteBoard = async (boardId: string) => {
  await axiosInstance.delete(`/boards/${boardId}`)
 }

 export const editTask = async (task: Task) => {
  await axiosInstance.put(`/tasks/${task._id}`, {task: task})
 }

 export const deleteTask = async (taskId: string) => {
  await axiosInstance.delete(`/tasks/${taskId}`)
 }