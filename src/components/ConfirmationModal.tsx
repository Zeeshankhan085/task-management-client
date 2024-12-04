import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import React from 'react'

function ConfirmationModal({ title, description, onCancel, onConfirm, isOpen }: { title: string, onCancel: () => void, onConfirm: () => void, description: string, isOpen: boolean }) {
  return (
    <Modal centered onClose={onCancel} opened={isOpen} title={title}>
      <Stack>
        <Text>{description}</Text>
        <Group grow>
          <Button onClick={onConfirm} color="red.4" radius="lg">Delete</Button>
          <Button onClick={onCancel} radius="lg" color="brand.2">Cancel</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ConfirmationModal

// Are you sure you want to delete '{currentBoard?.name}'. This action will remove all columns and tasks and cannot be reversed.
{/* <Button onClick={deleteBoard} color="red.4" radius="lg">Delete</Button>
        <Button onClick={cancel} radius="lg" color="brand.2">Cancel</Button> */}