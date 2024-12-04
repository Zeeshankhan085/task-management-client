// @ts-nocheck
import { useEffect, useState } from 'react'
import { useBoardStore } from '../store/board'
import { Stack, TextInput, Textarea, Select, Button, Text, ActionIcon } from '@mantine/core'
import { useMutation, useQueryClient } from 'react-query'
import { createTask, editTask } from '../api'
import { IconX } from '@tabler/icons-react';
import { Task } from './modal'
function NewTask({ task = null, close }: { task: Task | null, close: () => void }) {
  const { currentBoard } = useBoardStore()
  const queryClient = useQueryClient()
  const [formValue, setFormValue] = useState({
    title: '',
    description: '',
    status: currentBoard?.columns[0].name,
    subTasks: [{
      title: '',
      isCompleted: false
    }]
  })
  useEffect(() => {
    if (task) {
      setFormValue(task)
    }
  }, [])
  const handleInputChange = (target: keyof typeof formValue, value: string) => {
    setFormValue({
      ...formValue,
      [target]: value
    })
  }

  const handleSubTaskInputChange = (value: string, index: number) => {
    const tasks = formValue.subTasks.map((task, taskIndex) => {
      if (index === taskIndex) {
        // Return a new object instead of mutating the existing one
        return { ...task, title: value };
      } else {
        return task;
      }
    });

    console.log({ tasks });

    setFormValue({ ...formValue, subTasks: tasks });
  }

  const getEmptySubTask = () => {
    return {
      title: '',
      isCompleted: false,
    }
  }
  const addNewTask = () => {
    const tasks = [...formValue.subTasks, getEmptySubTask()]
    setFormValue({ ...formValue, subTasks: tasks })
  }

  const mutation = useMutation({
    mutationFn: task ? editTask : createTask,
    onSuccess: () => {

      // Invalidate and refetch boards after a successful mutation
      queryClient.invalidateQueries('boards');
      console.log('onsucess');
      close()
      // forceUpdate()//

    },
  });
  const deleteSubTask = (index: number) => {
    const tasks = formValue.subTasks.filter((task, taskIndex) => taskIndex !== index);
    setFormValue({ ...formValue, subTasks: tasks })
  }

  const onSubmit = () => {
    if (!formValue.title) {
      return;
    }
    if (!task) {

      const column = currentBoard?.columns.find(col => col.name === formValue.status)
      const task = structuredClone(formValue)
      const filteredTask = task.subTasks.filter(subTask => subTask.title)
      task.subTasks = filteredTask
      mutation.mutate({ columnId: column?._id!, task: task })
    } else {
      mutation.mutate(formValue)

    }

  }
  return (
    <Stack>
      <TextInput description="Title" value={formValue.title} onChange={(e) => handleInputChange('title', e.target.value)} />
      <Textarea
        description="Description"
        value={formValue.description} onChange={(e) => handleInputChange('description', e.target.value)}
      />

      <Text>Subtasks</Text>
      {
        formValue.subTasks.map((subtask, index) => {
          return (
            <TextInput rightSection={<ActionIcon onClick={() => deleteSubTask(index)} color="gray.6" variant='transparent'><IconX size={18} /></ActionIcon>} placeholder="eg. Make Coffee" value={subtask.title} onChange={(e) => handleSubTaskInputChange(e.target.value, index)} />
          )
        })
      }
      <Button onClick={addNewTask} variant='light'>Add New Subtask</Button>
      <Select
        label="Status"
        data={currentBoard?.columns.map(col => col.name)}
        value={formValue.status} onChange={(value) => handleInputChange('status', value!)}
      />
      <Button onClick={onSubmit}>{task ? 'Save Changes' : 'Create Task'}</Button>
    </Stack>
  )
}

export default NewTask