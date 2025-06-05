import { Task } from "./modal";
import {
  Group,
  Title,
  Stack,
  Button,
  Text,
  Box,
  Checkbox,
  Menu,
  FocusTrap,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import ConfirmationModal from "./ConfirmationModal";
import { useMutation, useQueryClient } from "react-query";
import { deleteTask } from "../api";
import { useBoardStore } from "../store/board";

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
  const queryClient = useQueryClient();
  const { id: boardId } = useBoardStore((state) => state.currentBoard);

  const mutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      // Invalidate and refetch boards after a successful mutation
      queryClient.invalidateQueries("boards");
      deleteClose();
      closeTaskModal();
    },
  });
  return (
    <>
      <FocusTrap.InitialFocus />
      <Stack>
        <Group justify="space-between">
          <Title order={4}>{task.title}</Title>
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
        <Text>{task.description}</Text>
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
          mutation.mutate({ boardId, columnId, taskId: task.id })
        }
        title="Delete this task"
        description={`Are you sure you want to delete the '${task.title}' and its subtasks? This action cannot be reversed`}
        isOpen={deleteOpened}
      />
    </>
  );
}

export default TaskDetail;
