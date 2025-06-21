import {
  Title,
  Stack,
  Input,
  CloseButton,
  Text,
  Box,
  Button,
  Modal,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Board, Column } from "./modal";
import { useBoardStore } from "../store/board";
import { useMutation, useQueryClient } from "react-query";
import { addNewBoard, updateBoard } from "../api";

const emptyCurrentBoard = (): Board => {
  return {
    name: "",
    columns: [],
  };
};

function EditBoardWrapper({
  isNew = false,
  closeModal,
}: {
  isNew?: boolean;
  closeModal: (bool: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [deletedColumnIds, setDeletedColumnIds] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const { currentBoard, setCurrentBoardId } = useBoardStore();
  const current = currentBoard();
  const [formBoard, setFormBoard] = useState(
    isNew
      ? emptyCurrentBoard()
      : (structuredClone(current) ?? emptyCurrentBoard()),
  );
  const isEdit = !!formBoard?.id;
  const onSettled = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setProcessing(false);

    closeModal(false);
  };
  const deleteColumn = (index: number, columnId: string) => {
    const updatedColumns = formBoard?.columns.filter(
      (_, colIndex) => colIndex !== index,
    );
    setFormBoard({ ...formBoard, columns: updatedColumns || [] });
    setDeletedColumnIds([...deletedColumnIds, columnId]);
  };
  const editMutation = useMutation({
    mutationFn: ({
      boardId,
      board,
    }: {
      boardId: string;
      board: Board & { deletedColumnIds: string[] };
    }) => updateBoard(boardId, board),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"], {
        refetchActive: true,
        exact: true,
      });
    },
    onSettled: onSettled,
  });

  const newBoardMutation = useMutation({
    mutationFn: addNewBoard,
    onSuccess: (data: Board) => {
      queryClient.invalidateQueries(["boards"]);
      setCurrentBoardId(data.id);
    },
    onSettled: onSettled,
  });

  const handleBoardNameChange = (name: string) => {
    setFormBoard({ ...formBoard, name: name });
  };
  const handleInputChange = (index: number, value: string) => {
    const updatedColumns = formBoard.columns.map((col, colIndex) => {
      return colIndex === index ? { ...col, name: value } : col;
    });
    setFormBoard({ ...formBoard, columns: updatedColumns });
  };

  const addNewColumnCurrent = () => {
    const newColumn: Column = {
      name: "",
      tasks: [],
    };
    setFormBoard({ ...formBoard, columns: [...formBoard.columns, newColumn] });
  };

  const saveChanges = () => {
    setProcessing(true);
    formBoard.columns = formBoard?.columns.filter((col) => col.name) ?? [];
    if (isEdit) {
      editMutation.mutate({
        boardId: formBoard?.id,
        board: { ...formBoard, deletedColumnIds: deletedColumnIds },
      });
    } else {
      newBoardMutation.mutate({
        name: formBoard.name,
        columns: formBoard.columns,
      });
    }
  };
  return (
    <Modal opened={true} onClose={() => closeModal(false)}>
      <div>
        <Title size="h4">{isEdit ? "Edit" : "Add New"} Board</Title>
        <Box mt="md">
          <Input.Wrapper description="Board Name">
            <Input
              value={formBoard.name}
              onChange={(e) => handleBoardNameChange(e.target.value)}
            />
          </Input.Wrapper>
        </Box>
        <Text mt="md" mb={isEdit ? "-sm" : ""}>
          Columns
        </Text>
        <Stack mt="lg" gap="sm">
          {" "}
          {formBoard.columns?.map((column, index) => {
            return (
              <Input
                value={column.name}
                key={index}
                onChange={(event) =>
                  handleInputChange(index, event.currentTarget.value)
                }
                rightSectionPointerEvents="all"
                rightSection={
                  <CloseButton
                    onClick={() => deleteColumn(index, column.id)}
                    style={{ display: column.name ? undefined : "none" }}
                  />
                }
              />
            );
          })}
          <Button
            onClick={addNewColumnCurrent}
            variant="light"
            leftSection={<IconPlus />}
          >
            Add New Column
          </Button>
          {isEdit && (
            <Button loading={processing} onClick={saveChanges}>
              Save Changes
            </Button>
          )}
          {!isEdit && (
            <Button loading={processing} onClick={saveChanges}>
              Create New Board
            </Button>
          )}
        </Stack>
      </div>
    </Modal>
  );
}

export default EditBoardWrapper;
