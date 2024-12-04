import { Title, Stack, Input, CloseButton, Text, Box, Button } from "@mantine/core"
import { IconPlus } from '@tabler/icons-react'
import { Column } from "./modal";

function EditBoard({ isEdit = false, saveChanges, handleInputChange, columns, handleBoardChange, boardName, addNewColumn }: { isEdit: boolean, saveChanges: () => void, handleInputChange: (index: number, value: string) => void, columns: Column[], boardName: string, handleBoardChange: (value: string) => void, addNewColumn: () => void }) {



  return (
    <div>
      <Title size="h4">{isEdit ? 'Edit' : 'Add New'} Board</Title>
      <Box mt="md">
        <Input.Wrapper description="Board Name">
          <Input value={boardName} onChange={(e) => handleBoardChange(e.target.value)} />
        </Input.Wrapper>
      </Box>
      <Text mt="md" mb={isEdit ? '-sm' : ''}>Columns</Text>
      <Stack mt="lg" gap="sm">     {columns?.map((column, index) => {
        return (
          <Input
            value={column.name}
            key={column._id}
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
        <Button onClick={addNewColumn} variant="light" leftSection={<IconPlus />}>Add New Column</Button>
        {isEdit && <Button onClick={saveChanges}>Save Changes</Button>}
        {!isEdit && <Button onClick={saveChanges}>Create New Board</Button>}

      </Stack>
    </div>
  )
}

export default EditBoard