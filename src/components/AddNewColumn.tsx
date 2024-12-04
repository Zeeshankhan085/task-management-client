import { Card, Center, Text, Stack, Button, Grid } from '@mantine/core';
import { useBoardStore } from '../store/board';
import { useState } from 'react';
import EditBoardWrapper from './EditBoardWrapper';


function AddNewColumn() {


  const { currentBoard } = useBoardStore();

  const [opened, setOpened] = useState(false);

  return (
    <>
      {currentBoard && currentBoard.columns.filter(col => col.name).length > 0 ?
        <Grid.Col span={{ base: 4, md: 3, xl: 2 }}> <Card shadow="sm" padding="lg" radius="md" withBorder h="60%">
          <Center onClick={() => setOpened(true)} h="100%" style={{ cursor: 'pointer' }}>
            <Text>
              + New Column

            </Text>

          </Center>

        </Card>
        </Grid.Col>
        :

        <Center style={{ height: "calc(100vh - 200px)" }} w="100%">
          <Stack align="center">
            <Text style={{ textAlign: 'center' }}>This board is empty. Create a new column <br /> to get started.</Text>
            <Button onClick={() => setOpened(true)}>Add New Column</Button>
          </Stack>
        </Center >
      }

      {opened && <EditBoardWrapper isEdit={true} closeModal={setOpened} />}
    </>
  )
}

export default AddNewColumn