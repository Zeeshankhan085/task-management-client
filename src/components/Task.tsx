import { Card, Text, Overlay, Modal, Button } from '@mantine/core'
import { Task as ITask, } from './modal'
import { useDisclosure } from '@mantine/hooks';
import TaskDetail from './TaskDetail';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useEffect, useRef, useState } from 'react';
// import {DragHandleButton} from '@atlaskit/pragmatic-drag-and-drop' 
import { DragHandleButton } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button';
import NewTask from './NewTask';


function Task({ task }: { task: ITask }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [newTaskModal, { open: openNewTaskModal, close: closeNewTaskModal }] = useDisclosure(false);

  const [dragging, setDragging] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const dragHandleRef = useRef<HTMLButtonElement | null>(null)
  // const [currentTask, setCurrentTask] = useState<null | ITask>(null)
  useEffect(() => {
    if (!ref.current) {
      return
    }

    return draggable({
      element: ref.current,
      getInitialData: () => ({ taskId: task._id }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      // dragHandle: dragHandleRef.current!
    })
  })

  return (
    <>
      <Card
        ref={ref}
        opacity={dragging ? 0.5 : 1}
        shadow="sm"
        padding="lg"
        radius="md"
        style={{ cursor: !dragging ? 'grab' : '' }}
        withBorder>
        <Text style={{
          'cursor': 'pointer', whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '200px'
        }} color='dark' onClick={open}>{task.title}</Text>
        {/* <Overlay
          opacity={0}
        component='a'
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        target="_blank"
        /> */}
        {/* <DragHandleButton label="drag me" ref={dragHandleRef} /> */}

      </Card>
      <Modal centered opened={opened} onClose={close} withCloseButton={false} >
        <TaskDetail openNewTaskModal={() => { openNewTaskModal(); close() }} task={task} />
      </Modal>
      <Modal centered opened={newTaskModal} onClose={closeNewTaskModal} withCloseButton={false} title="Edit Task">
        <NewTask close={closeNewTaskModal} task={task} />
      </Modal>
    </>


  )
}

export default Task



const DragHandle = () => {
  return (
    <div>Drag me</div>
  )
}