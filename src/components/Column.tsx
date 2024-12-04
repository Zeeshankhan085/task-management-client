import { Stack, Text } from "@mantine/core";
import { Column as IColumn } from "./modal";
import Task from "./Task";
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { useCallback, useEffect, useRef } from "react";
import { BaseEventPayload } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { moveTask } from '../api';
import { useMutation, useQueryClient } from 'react-query';
import { useBoardStore } from "../store/board";
import { Task as ITask } from "./modal"

interface ColumnProps {
  column: IColumn;
}

function Column({ column }: ColumnProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const { currentBoard } = useBoardStore();



  const mutation = useMutation({
    mutationFn: moveTask,
    onSuccess: () => {
      // Invalidate and refetch boards after a successful mutation
      queryClient.invalidateQueries('boards');
    },
  });

  const onDrop = useCallback(({ location, self, source }: BaseEventPayload) => {
    const getTaskById = (taskId: string): ITask | null => {
      return currentBoard?.columns.reduce((foundTask, col) => {
        return foundTask || col.tasks.find(task => task._id === taskId) || null;
      }, null);
    };
    const sourceColumnId = location.initial.dropTargets[0].data.columnId;
    const taskId = source.data.taskId;
    const targetColumnId = self.data.columnId;

    if (sourceColumnId && targetColumnId) {
      const findSourceColumn = currentBoard?.columns.find(col => col._id === sourceColumnId);
      const findTargetColumn = currentBoard?.columns.find(col => col._id === targetColumnId);

      if (findSourceColumn && findTargetColumn) {
        const task = getTaskById(taskId as string); // Ensure task is valid or null

        if (task && currentBoard && currentBoard._id) {
          findSourceColumn.tasks = findSourceColumn.tasks.filter(t => t._id !== taskId);
          findTargetColumn.tasks.push(task);

          mutation.mutate({ boardId: currentBoard._id, taskId, sourceColumnId, targetColumnId });
        } else {
          console.error("Task not found");
        }
      }
    }
  }, [currentBoard, mutation])

  useEffect(() => {
    if (!ref.current) {
      console.log('ref not set correctly');
      return;
    }

    return dropTargetForElements({
      element: ref.current,
      onDrop: onDrop,
      getData: () => ({ columnId: column._id }),
      getIsSticky: () => true,
    });
  }, [column._id, onDrop]);

  return (
    <Stack>
      <Text
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '200px',
          fontWeight: 500,
        }}
      >
        {column.name}
      </Text>

      <Stack mih="80vh" color="red" ref={ref}>
        {column.tasks.map(task => (
          <Task key={task._id} task={task} />
        ))}
      </Stack>
    </Stack>
  );
}

export default Column;
