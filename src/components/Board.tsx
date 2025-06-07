import { useBoardStore } from "../store/board";
import { Center, Text, Grid, ScrollArea } from "@mantine/core";
// import { useListState } from '@mantine/hooks';
import { useQuery } from "react-query";
import { fetchBoards } from "../api";
import Column from "./Column";
import AddNewColumn from "./AddNewColumn";
import { Board as BoardI } from "./modal";
// import { DragEndEvent, DragStartEvent, } from '@dnd-kit/core';

function Board() {
  const { currentBoard, setCurrentBoardId, setBoards } = useBoardStore();
  const current = currentBoard();
  const { isLoading } = useQuery(["boards"], fetchBoards, {
    onSuccess: (fetchedBoards: BoardI[]) => {
      // Set boards in Zustand store

      setBoards(fetchedBoards);
      // Set the first board as current only if it's the initial load
      const current = currentBoard();
      if (!current && fetchedBoards.length > 0) {
        setCurrentBoardId(fetchedBoards[0].id);
      }
      if (current) {
        const updated = fetchedBoards.find((board) => board.id === current.id);
        if (updated) {
          setCurrentBoardId(updated.id);
        }
      }
    },
  });

  const columns = current?.columns ?? [];

  if (isLoading)
    return (
      <Center mih="100%">
        <Text>Loading...</Text>
      </Center>
    );

  return (
    <>
      <ScrollArea
        scrollbars="x"
        type="never"
        styles={{
          root: {
            maxWidth: "100%",
            overflowX: "auto",
          },
          viewport: {
            width: "100%",
            padding: 0,
          },
        }}
      >
        <Grid
          styles={{
            inner: {
              display: "flex",
              flexWrap: "nowrap",
            },
          }}
          // h="100%"
        >
          {columns
            .filter((col) => col.name)
            .map((column) => (
              <Grid.Col
                key={column.id}
                span={{ base: 4, md: 3, lg: 2 }}
                style={{
                  flex: "0 0 auto",
                }}
              >
                <Column column={column} />
              </Grid.Col>
            ))}
          <AddNewColumn />
        </Grid>
      </ScrollArea>
    </>
  );
}

export default Board;
