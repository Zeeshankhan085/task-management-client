import { useState } from "react";
import { useBoardStore } from "../store/board";
import { Flex, Button, Text, Modal, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NewTask from "./NewTask";
import { IconDotsVertical } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "react-query";
import { deleteBoard } from "../api";
import ConfirmationModal from "./ConfirmationModal";
import EditBoardWrapper from "./EditBoardWrapper";
import { Board } from "./modal";

function Header() {
  const queryClient = useQueryClient();

  const { currentBoard, setCurrentBoardId } = useBoardStore();
  const current = currentBoard();
  const [opened, { open, close }] = useDisclosure(false);

  const [deleteOpened, { open: deleteOpen, close: deleteClose }] =
    useDisclosure(false);

  const mutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      // Invalidate and refetch boards after a successful mutation
      queryClient
        .invalidateQueries(["boards"], {
          refetchActive: true,
          exact: true,
        })
        .then(() => {
          const updatedBoards = queryClient.getQueryData(["boards"]) as Board[];
          if (updatedBoards) {
            setCurrentBoardId(updatedBoards[0].id);
          }
        });
      deleteClose();
    },
  });
  const [editBoardModal, setEditBoardModal] = useState(false);
  return (
    <>
      <Flex p="sm" justify="space-between">
        <Text>{current?.name}</Text>
        <Flex align="=center">
          <Button
            size="xs"
            disabled={current?.columns.length === 0 || !current?.columns}
            onClick={open}
          >
            Add New Task
          </Button>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button pr="0" variant="transparent">
                <IconDotsVertical />
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={() => setEditBoardModal(true)}>
                Edit Board
              </Menu.Item>
              <Menu.Item color="red" onClick={deleteOpen}>
                Delete Board
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Flex>
      <Modal opened={opened} onClose={close} title="Add New Task">
        {current && <NewTask close={close} task={null} />}
      </Modal>
      <ConfirmationModal
        onCancel={deleteClose}
        onConfirm={() => mutation.mutate(current.id)}
        title="Delete this board"
        description={`Are you sure you want to delete ${current?.name}. This action will remove all columns and tasks and cannot be reversed`}
        isOpen={deleteOpened}
      />
      {editBoardModal && <EditBoardWrapper closeModal={setEditBoardModal} />}
    </>
  );
}

export default Header;
