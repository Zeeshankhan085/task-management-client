import { Task } from "./modal";
import {
  Group,
  Stack,
  Button,
  Text,
  Box,
  Checkbox,
  Input,
  Menu,
  FocusTrap,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import ConfirmationModal from "./ConfirmationModal";
import { useMutation, useQueryClient } from "react-query";
import { deleteTask, patchEditTask } from "../api";
import { useBoardStore } from "../store/board";
import Editor from "./Editor";
import { useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";

function TaskDetail({
  columnId,
  task,
  openNewTaskModal,
  closeTaskModal,
}: {
  columnId: string;
  task: Task;
  openNewTaskModal: () => void;
  closeTaskModal: () => void;
}) {
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
    useDisclosure(false);
  const [title, setTitle] = useState(task.title);
  const queryClient = useQueryClient();
  const { currentBoardId } = useBoardStore();

  const mutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries("boards");
      deleteClose();
      closeTaskModal();
    },
  });

  const editTaskMutation = useMutation({
    mutationFn: patchEditTask,
    onSuccess: () => {
      // queryClient.invalidateQueries("boards");
      // deleteClose();
      // closeTaskModal();
    },
  });
  const debouncedInputCb = useDebouncedCallback((updatedTask) => {
    console.log(updatedTask);

    editTaskMutation.mutate({
      boardId: currentBoardId,
      columnId,
      taskId: task.id,
      task: updatedTask,
    });
  }, 500);

  return (
    <>
      <FocusTrap.InitialFocus />
      <Stack>
        <Group justify="space-between" wrap="nowrap">
          <Input
            w="100%"
            styles={{
              input: {
                fontSize: "1.2rem", // Make it large like a heading
                fontWeight: 700,
              },
            }}
            variant="unstyled"
            value={title}
            onChange={(e) => {
              console.log(e);
              setTitle(e.target.value);
              debouncedInputCb({ title: e.target.value });
            }}
          />
          ;
          <Menu>
            <Menu.Target>
              <Button variant="transparent">
                <IconDotsVertical size={18} />
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                onClick={() => {
                  openNewTaskModal();
                }}
              >
                Edit Task
              </Menu.Item>
              <Menu.Item onClick={deleteOpen} color="red">
                Delete Task
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Editor content={task.description} handleUpdate={debouncedInputCb} />
        {task.subTasks.length > 0 && <Text>Subtasks</Text>}
        {task.subTasks.map((subtask, index) => {
          return (
            <Box key={index}>
              {subtask.isCompleted}
              <Checkbox
                label={subtask.title}
                checked={subtask.isCompleted}
                onChange={(e) => (subtask.isCompleted = e.target.checked)}
              />
            </Box>
          );
        })}
      </Stack>

      <ConfirmationModal
        onCancel={() => {
          deleteClose();
          closeTaskModal();
        }}
        onConfirm={() =>
          mutation.mutate({
            boardId: currentBoardId,
            columnId,
            taskId: task.id,
          })
        }
        title="Delete this task"
        description={`Are you sure you want to delete the '${task.title}' and its subtasks? This action cannot be reversed`}
        isOpen={deleteOpened}
      />
    </>
  );
}

export default TaskDetail;
