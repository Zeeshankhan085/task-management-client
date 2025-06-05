import { useEffect, useState } from "react";
import { useBoardStore } from "../store/board";
import {
  Stack,
  TextInput,
  Textarea,
  Select,
  Button,
  Text,
  ActionIcon,
} from "@mantine/core";
import { useMutation, useQueryClient } from "react-query";
import { createTask, editTask } from "../api";
import { IconX } from "@tabler/icons-react";
import { Task } from "./modal";

type NewTaskProps = {
  columnId?: string;
  task: Task | null;
  close: () => void;
};

const getEmptySubTask = (): {
  id?: string;
  title: string;
  isCompleted: boolean;
} => ({
  title: "",
  isCompleted: false,
});

function NewTask({ columnId, task = null, close }: NewTaskProps) {
  const { currentBoard } = useBoardStore();
  const queryClient = useQueryClient();
  const [deletedSubTaskIds, setDeletedSubTaskIds] = useState<string[]>([]);

  const [formValue, setFormValue] = useState({
    title: "",
    description: "",
    status: currentBoard?.columns[0]?.name || "",
    subTasks: [getEmptySubTask()],
  });

  useEffect(() => {
    if (task) {
      setFormValue(task);
    }
  }, [task]);

  const updateFormValue = (key: keyof typeof formValue, value: string) => {
    setFormValue((prev) => ({ ...prev, [key]: value }));
  };

  const updateSubTaskTitle = (index: number, value: string) => {
    setFormValue((prev) => ({
      ...prev,
      subTasks: prev.subTasks.map((subTask, i) =>
        i === index ? { ...subTask, title: value } : subTask,
      ),
    }));
  };

  const addSubTask = () => {
    setFormValue((prev) => ({
      ...prev,
      subTasks: [...prev.subTasks, getEmptySubTask()],
    }));
  };

  const removeSubTask = (index: number, id: string) => {
    if (id) {
      setDeletedSubTaskIds((prev) => [...prev, id]);
    }
    setFormValue((prev) => ({
      ...prev,
      subTasks: prev.subTasks.filter((_, i) => i !== index),
    }));
  };

  const onSuccess = () => {
    queryClient.invalidateQueries("boards");
    close();
  };

  const createMutation = useMutation({ mutationFn: createTask, onSuccess });
  const editMutation = useMutation({ mutationFn: editTask, onSuccess });

  const onSubmit = () => {
    if (!formValue.title || !currentBoard?.id) return;

    const clonedTask = structuredClone(formValue);
    clonedTask.subTasks = clonedTask.subTasks.filter((s) => s.title.trim());

    if (!task) {
      const newColId = currentBoard.columns.find(
        (col) => col.name === formValue.status,
      ).id;
      createMutation.mutate({
        boardId: currentBoard.id,
        columnId: newColId,
        task: clonedTask,
      });
    } else {
      editMutation.mutate({
        boardId: currentBoard.id,
        columnId,
        taskId: task.id,
        deletedSubTaskIds,
        task: formValue,
      });
    }
  };

  return (
    <Stack>
      <TextInput
        description="Title"
        value={formValue.title}
        onChange={(e) => updateFormValue("title", e.target.value)}
      />

      <Textarea
        description="Description"
        value={formValue.description}
        onChange={(e) => updateFormValue("description", e.target.value)}
      />

      <Text>Subtasks</Text>
      {formValue.subTasks.map((subtask, index) => (
        <TextInput
          key={index}
          rightSection={
            <ActionIcon
              onClick={() => removeSubTask(index, subtask.id)}
              color="gray.6"
              variant="transparent"
            >
              <IconX size={18} />
            </ActionIcon>
          }
          placeholder="e.g., Make Coffee"
          value={subtask.title}
          onChange={(e) => updateSubTaskTitle(index, e.target.value)}
        />
      ))}

      <Button onClick={addSubTask} variant="light">
        Add New Subtask
      </Button>

      <Select
        label="Status"
        data={currentBoard?.columns.map((col) => col.name) || []}
        value={formValue.status}
        onChange={(value) => updateFormValue("status", value!)}
      />

      <Button onClick={onSubmit}>
        {task ? "Save Changes" : "Create Task"}
      </Button>
    </Stack>
  );
}

export default NewTask;
