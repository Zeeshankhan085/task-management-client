import { Button, Group, Modal, Stack, Text } from "@mantine/core";

function ConfirmationModal({
  title,
  description,
  onCancel,
  onConfirm,
  isOpen,
}: {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  description: string;
  isOpen: boolean;
}) {
  return (
    <Modal centered onClose={onCancel} opened={isOpen} title={title}>
      <Stack>
        <Text>{description}</Text>
        <Group grow>
          <Button onClick={onConfirm} color="red.4" radius="lg">
            Delete
          </Button>
          <Button onClick={onCancel} radius="lg" color="brand.2">
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default ConfirmationModal;
