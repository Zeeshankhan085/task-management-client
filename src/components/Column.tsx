import { Stack, Text } from "@mantine/core";
import { Column as IColumn } from "./modal";
import Task from "./Task";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import { useCallback, useEffect, useRef } from "react";
import {
  ElementDragType,
  DropTargetEventBasePayload,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { moveTask } from "../api";
import { useMutation, useQueryClient } from "react-query";
import { useBoardStore } from "../store/board";
import { Task as ITask } from "./modal";

interface ColumnProps {
  column: IColumn;
}

function Column({ column }: ColumnProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const { currentBoard, updateBoard, currentBoardId } = useBoardStore();
  const current = currentBoard();
  const mutation = useMutation({
    mutationFn: moveTask,
    onSuccess: () => {
      queryClient.invalidateQueries("boards");
    },
  });

  const onDrop = useCallback(
    ({
      location,
      self,
      source,
    }: DropTargetEventBasePayload<ElementDragType>) => {
      const getTaskById = (taskId: string): ITask | null => {
        if (current) {
          for (const col of current.columns) {
            const foundTask = col.tasks.find((task) => task.id === taskId);
            if (foundTask) {
              return foundTask;
            }
          }
        }
        return null;
      };

      const sourceColumnId = location.initial.dropTargets[0].data
        .columnId as string;
      const taskId = source.data.taskId as string;
      const targetColumnId = self.data.columnId as string;

      if (sourceColumnId && targetColumnId) {
        const findSourceColumn = current?.columns.find(
          (col) => col.id === sourceColumnId,
        );
        const findTargetColumn = current?.columns.find(
          (col) => col.id === targetColumnId,
        );

        if (findSourceColumn && findTargetColumn) {
          const task = getTaskById(taskId as string); // Ensure task is valid or null

          if (task && current && currentBoardId) {
            findSourceColumn.tasks = findSourceColumn.tasks.filter(
              (t) => t.id !== taskId,
            );
            findTargetColumn.tasks.push(task);
            updateBoard({
              ...current,
              columns: [...current.columns],
            });

            mutation.mutate({
              boardId: currentBoardId,
              taskId,
              sourceColumnId,
              targetColumnId,
            });
          } else {
            console.error("Task not found");
          }
        }
      }
    },
    [current, mutation, updateBoard, currentBoardId],
  );

  useEffect(() => {
    if (!ref.current) {
      console.log("ref not set correctly");
      return;
    }

    return dropTargetForElements({
      element: ref.current,
      onDrop: onDrop,
      getData: () => ({ columnId: column.id }),
      getIsSticky: () => true,
    });
  }, [column.id, onDrop]);

  return (
    <Stack>
      <Text
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "200px",
          fontWeight: 500,
          fontSize: "20px",
        }}
      >
        {column.name}
      </Text>

      <Stack mih="80vh" color="red" ref={ref}>
        {column.tasks.map((task) => (
          <Task columnId={column.id} key={task.id} task={task} />
        ))}
      </Stack>
    </Stack>
  );
}

export default Column;
