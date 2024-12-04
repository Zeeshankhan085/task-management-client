import { Text, Button, Group, Stack } from '@mantine/core'
import { useBoardStore } from '../store/board'



function DeleteBoard({ cancel, deleteBoard }: { cancel: () => void, deleteBoard: () => void }) {

  const { currentBoard } = useBoardStore()
  return (
    <Stack>
      <Text>Are you sure you want to delete '{currentBoard?.name}'. This action will remove all columns and tasks and cannot be reversed.</Text>
      <Group grow>
        <Button onClick={deleteBoard} color="red.4" radius="lg">Delete</Button>
        <Button onClick={cancel} radius="lg" color="brand.2">Cancel</Button>
      </Group>
    </Stack>
  )
}

export default DeleteBoard