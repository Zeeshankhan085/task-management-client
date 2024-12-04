// @ts-nocheck
import { Title, Stack, Input, CloseButton, Text, Box, Button, Modal } from "@mantine/core"
import { IconPlus } from '@tabler/icons-react'
import { useState } from "react";
import { Board, Column } from "./modal";
import { useBoardStore } from "../store/board";
import { useMutation, useQueryClient } from 'react-query';
import { saveNewColumn, addNewBoard } from '../api'


function EditBoardWrapper({ isEdit = false, closeModal }: { isEdit: boolean, closeModal: (bool: boolean) => void }) {

  const queryClient = useQueryClient();

  const { currentBoard, restoreCurrentBoard } = useBoardStore();

  const editMutation = useMutation({
    mutationFn: saveNewColumn,
    onSuccess: (data: Board) => {
      // Invalidate and refetch boards after a successful mutation
      queryClient.invalidateQueries(['boards'], {
        refetchActive: true,
        exact: true,
      }).then(() => {
        const updatedBoards = queryClient.getQueryData(['boards']) as Board[]; // Fetch updated boards from cache
        if (updatedBoards) {
          restoreCurrentBoard(updatedBoards); // Restore the current board
        }
      });

      console.log('onSuccess:', data);

      // Optionally set the current board to the newly added/edited board
      // setCurrentBoard(data);
    },
  });
  const newBoardMutation = useMutation({
    mutationFn: addNewBoard,
    onSuccess: (data: Board) => {
      // Invalidate and refetch boards after a successful mutation
      queryClient.invalidateQueries(['boards'])
      //   , {
      //   refetchActive: true,
      //   exact: true,
      // }).then(() => {
      //   const updatedBoards = queryClient.getQueryData(['boards']) as Board[]; // Fetch updated boards from cache
      //   if (updatedBoards) {
      //     restoreCurrentBoard(updatedBoards); // Restore the current board
      //   }
      // });

      console.log('onSuccess:', data);

      // Optionally set the current board to the newly added/edited board
      // setCurrentBoard(data);
    },
  });

  const [existingBoard, setExistingBoard] = useState(structuredClone(currentBoard))

  const [emptyBoard, setEmptyBoard] = useState<Board>({
    name: '',
    columns: [],
  })
  let editBoard = isEdit ? existingBoard : emptyBoard;
  const handleBoardNameChange = (name: string) => {
    if (isEdit) {
      if (existingBoard) {
        setExistingBoard({ ...existingBoard, name: name })
      }
    } else {
      setEmptyBoard({ ...emptyBoard, name })
    }
  }
  const handleInputChange = (index: number, value: string) => {
    if (editBoard) {
      const newCols = editBoard.columns.map((col, colIndex) => colIndex === index ? { ...col, name: value } : col)
      if (isEdit && existingBoard) {
        setExistingBoard({ ...existingBoard, columns: newCols })
      } else {
        setEmptyBoard({ ...editBoard, columns: newCols })
      }
      // setCurrentBoard({ ...editBoard, columns: newCols })
    }
  }

  const addNewColumnCurrent = () => {
    const newColumn: Column = {
      name: "",
      tasks: []
    };
    if (editBoard) {
      editBoard = { ...editBoard, columns: [...editBoard.columns, newColumn] }
      if (isEdit) {
        setExistingBoard(editBoard);
      } else {
        setEmptyBoard(editBoard)
      }
    }
  }

  const saveChanges = () => {
    const board = isEdit ? existingBoard : emptyBoard;
    if (isEdit) {

      editMutation.mutate({ boardId: board?._id!, boardName: board?.name!, columns: board?.columns! })
    } else {
      newBoardMutation.mutate({ name: board?.name! })
    }
    closeModal(false)
  }
  return (
    <Modal opened={true} onClose={() => closeModal(false)}>
      <div>
        <Title size="h4">{isEdit ? 'Edit' : 'Add New'} Board</Title>
        <Box mt="md">
          <Input.Wrapper description="Board Name">
            <Input value={isEdit ? existingBoard?.name : emptyBoard.name} onChange={(e) => handleBoardNameChange(e.target.value)} />
          </Input.Wrapper>
        </Box>
        <Text mt="md" mb={isEdit ? '-sm' : ''}>Columns</Text>
        <Stack mt="lg" gap="sm">     {editBoard?.columns?.map((column, index) => {
          return (
            <Input
              value={column.name}
              key={index}
              onChange={(event) => handleInputChange(index, event.currentTarget.value)}
              rightSectionPointerEvents="all"
              rightSection={
                <CloseButton
                  onClick={() => handleInputChange(index, '')}
                  style={{ display: column.name ? undefined : 'none' }}
                />
              }
            />
          )
        })}
          <Button onClick={addNewColumnCurrent} variant="light" leftSection={<IconPlus />}>Add New Column</Button>
          {isEdit && <Button onClick={saveChanges}>Save Changes</Button>}
          {!isEdit && <Button onClick={saveChanges}>Create New Board</Button>}

        </Stack>
      </div>
    </Modal>
  )
}

export default EditBoardWrapper