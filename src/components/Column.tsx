import { Box, Stack, Text } from "@mantine/core"
import { Column as IColumn } from "./modal"
import Task from "./Task"
import { useDroppable } from "@dnd-kit/core"
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTask from "./SortableTask";
import { useEffect, useRef } from "react";
import { BaseEventPayload } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { moveTask } from '../api';
import { useMutation, useQueryClient } from 'react-query';
import { useBoardStore } from "../store/board";


function Column({ column }: { column: IColumn }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()
  const { currentBoard } = useBoardStore()

  const { setNodeRef } = useDroppable({
    id: column._id,
  });

  const getTaskById = (taskId: string) => {
    return currentBoard?.columns.reduce((foundTask, col) => {
      return foundTask || col.tasks.find(task => task._id === taskId);
    }, null);
  };

  const mutation = useMutation({
    mutationFn: moveTask,
    onSuccess: () => {

      // Invalidate and refetch boards after a successful mutation
      queryClient.invalidateQueries('boards');

    },
  });
  const onDrop = ({ location, self, source }: BaseEventPayload) => {
    const sourceColumnId = location.initial.dropTargets[0].data.columnId
    const taskId = source.data.taskId
    const targetColumnId = self.data.columnId
    console.log();

    if (sourceColumnId && targetColumnId) {
      const findSourceColumn = currentBoard?.columns.find(col => col._id === sourceColumnId)
      const findTargetColumn = currentBoard?.columns.find(col => col._id === targetColumnId);
      if (findSourceColumn && findTargetColumn) {
        const task = getTaskById(taskId as string);
        findSourceColumn.tasks = findSourceColumn.tasks.filter(task => task._id !== taskId)
        findTargetColumn.tasks.push(task)
        mutation.mutate({ boardId: currentBoard?._id, taskId, sourceColumnId, targetColumnId })
      }
    }

  };
  useEffect(() => {
    if (!ref.current) {
      console.log('ref not set correctly');

      return
    }
    return dropTargetForElements({
      element: ref.current,
      onDrop: onDrop,
      getData: () => ({ columnId: column._id }),
      getIsSticky: () => true
    });
  }, [])
  return <Stack>
    <Text style={{
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '200px',
      fontWeight: 500
    }}>{column.name}</Text>
    {/* <SortableContext
      id={column._id}
      items={column.tasks}
      strategy={verticalListSortingStrategy}
    >
      <Box ref={setNodeRef}>{column.tasks.map((task, index) => <><SortableTask id={task._id}> <Task index={index} task={task} /></SortableTask></>)}</Box>
    </SortableContext> */}
    <Stack mih="80vh" color="red" ref={ref}>
      {column.tasks.map((task, index) => <><Task key={task._id} task={task} /></>)}
    </Stack>
  </Stack>
}

export default Column
