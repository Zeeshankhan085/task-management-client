import { Card, Text, Modal, Flex, Stack, Avatar } from "@mantine/core";
import { Task as ITask } from "./modal";
import { useDisclosure } from "@mantine/hooks";
import TaskDetail from "./TaskDetail";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState, memo } from "react";
import NewTask from "./NewTask";
import fakerUtils from "../utils/useFaker";

function Task({ columnId, task }: { columnId: string; task: ITask }) {
  const { avatar } = fakerUtils();

  const [opened, { open, close }] = useDisclosure(false);
  const [newTaskModal, { open: openNewTaskModal, close: closeNewTaskModal }] =
    useDisclosure(false);

  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    return draggable({
      element: ref.current,
      getInitialData: () => ({ taskId: task.id }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  });
  useEffect(() => {
    console.log("rerendered", task.id, columnId);
  });

  return (
    <>
      <Card
        ref={ref}
        opacity={dragging ? 0.5 : 1}
        padding="lg"
        radius="md"
        withBorder
        // shadow={dragging ? "xl" : "xs"}
        // style={{ cursor: dragging ? "grabbing" : "grab" }}
        style={{
          cursor: dragging ? "grabbing" : "grab",
          "--paper-shadow": dragging
            ? "var(--mantine-shadow-md)"
            : "var(--mantine-shadow-xs)",
        }}
      >
        <Stack>
          <Text
            component="a"
            href="#"
            style={{
              cursor: "pointer",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            c="brand.3"
            onClick={open}
          >
            {task.title}
          </Text>
          <Flex justify="space-between">
            <Avatar src={avatar} />
          </Flex>
        </Stack>
      </Card>
      <Modal
        centered
        size="xl"
        opened={opened}
        onClose={close}
        withCloseButton={false}
      >
        <TaskDetail
          columnId={columnId}
          openNewTaskModal={() => {
            openNewTaskModal();
            close();
          }}
          task={task}
          closeTaskModal={close}
        />
      </Modal>
      <Modal
        centered
        opened={newTaskModal}
        onClose={closeNewTaskModal}
        withCloseButton={false}
        title="Edit Task"
      >
        <NewTask columnId={columnId} close={closeNewTaskModal} task={task} />
      </Modal>
    </>
  );
}

export default memo(Task);
