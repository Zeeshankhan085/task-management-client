// import { useEffect, useState } from "react";
// import { useBoardStore } from "../store/board";
// import {
//   Stack,
//   TextInput,
//   Textarea,
//   Select,
//   Button,
//   Text,
//   ActionIcon,
// } from "@mantine/core";
// import { useMutation, useQueryClient } from "react-query";
// import { createTask, editTask } from "../api";
// import { IconX } from "@tabler/icons-react";
// import { Task } from "./modal";
// function NewTask({
//   columnId,
//   task = null,
//   close,
// }: {
//   columnId: string;
//   task: Task | null;
//   close: () => void;
// }) {
//   const { currentBoard } = useBoardStore();
//   const [deletedSubTaskIds, setDeletedSubTaskIds] = useState<string[]>([]);
//   const queryClient = useQueryClient();
//   const [formValue, setFormValue] = useState({
//     title: "",
//     description: "",
//     status: currentBoard?.columns[0].name,
//     subTasks: [
//       {
//         title: "",
//         isCompleted: false,
//       },
//     ],
//   });
//   useEffect(() => {
//     if (task) {
//       setFormValue(task);
//     }
//   }, [task]);
//   const handleInputChange = (target: keyof typeof formValue, value: string) => {
//     setFormValue({
//       ...formValue,
//       [target]: value,
//     });
//   };

//   const handleSubTaskInputChange = (value: string, index: number) => {
//     const tasks = formValue.subTasks.map((task, taskIndex) => {
//       if (index === taskIndex) {
//         // Return a new object instead of mutating the existing one
//         return { ...task, title: value };
//       } else {
//         return task;
//       }
//     });

//     setFormValue({ ...formValue, subTasks: tasks });
//   };

//   const getEmptySubTask = () => {
//     return {
//       title: "",
//       isCompleted: false,
//     };
//   };
//   const addNewTask = () => {
//     const subTasks = [...formValue.subTasks, getEmptySubTask()];
//     setFormValue({ ...formValue, subTasks: subTasks });
//   };

//   const editMutation = useMutation({
//     mutationFn: editTask,
//     onSuccess: () => {
//       // Invalidate and refetch boards after a successful mutation
//       queryClient.invalidateQueries("boards");
//       console.log("onsucess");
//       close();
//       // forceUpdate()//
//     },
//   });

//   const createMutation = useMutation({
//     mutationFn: createTask,
//     onSuccess: () => {
//       // Invalidate and refetch boards after a successful mutation
//       queryClient.invalidateQueries("boards");
//       console.log("onsucess");
//       close();
//       // forceUpdate()//
//     },
//   });
//   const deleteSubTask = (index: number, id: string) => {
//     const tasks = formValue.subTasks.filter(
//       (_, taskIndex) => taskIndex !== index,
//     );
//     setDeletedSubTaskIds([...deletedSubTaskIds, id]);
//     setFormValue({ ...formValue, subTasks: tasks });
//   };

//   const onSubmit = () => {
//     if (!formValue.title) {
//       return;
//     }
//     if (!task && currentBoard?.id) {
//       const task = structuredClone(formValue);
//       const filteredTask = task.subTasks.filter((subTask) => subTask.title);
//       task.subTasks = filteredTask;
//       if (columnId) {
//         createMutation.mutate({
//           boardId: currentBoard.id,
//           columnId,
//           task: task,
//         });
//       }
//     } else {
//       editMutation.mutate({
//         boardId: currentBoard.id,
//         columnId,
//         taskId: task.id,
//         deletedSubTaskIds,
//         task: formValue as unknown as Task,
//       });
//     }
//   };
//   return (
//     <Stack>
//       <TextInput
//         description="Title"
//         value={formValue.title}
//         onChange={(e) => handleInputChange("title", e.target.value)}
//       />
//       <Textarea
//         description="Description"
//         value={formValue.description}
//         onChange={(e) => handleInputChange("description", e.target.value)}
//       />

//       <Text>Subtasks</Text>
//       {formValue.subTasks.map((subtask, index) => {
//         return (
//           <TextInput
//             rightSection={
//               <ActionIcon
//                 onClick={() => deleteSubTask(index, subtask.id)}
//                 color="gray.6"
//                 variant="transparent"
//               >
//                 <IconX size={18} />
//               </ActionIcon>
//             }
//             placeholder="eg. Make Coffee"
//             value={subtask.title}
//             onChange={(e) => handleSubTaskInputChange(e.target.value, index)}
//           />
//         );
//       })}
//       <Button onClick={addNewTask} variant="light">
//         Add New Subtask
//       </Button>
//       <Select
//         label="Status"
//         data={currentBoard?.columns.map((col) => col.name)}
//         value={formValue.status}
//         onChange={(value) => handleInputChange("status", value!)}
//       />
//       <Button onClick={onSubmit}>
//         {task ? "Save Changes" : "Create Task"}
//       </Button>
//     </Stack>
//   );
// }

// export default NewTask;

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
  columnId: string;
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
      createMutation.mutate({
        boardId: currentBoard.id,
        columnId,
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
