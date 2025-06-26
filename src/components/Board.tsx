import { useBoardStore } from "../store/board";
import { Center, Grid, ScrollArea, Skeleton } from "@mantine/core";
import { useQuery } from "react-query";
import { fetchBoards } from "../api";
import Column from "./Column";
import AddNewColumn from "./AddNewColumn";
import { Board as BoardI } from "./modal";
import { useEffect } from "react";

function Board() {
  const { currentBoard, setCurrentBoardId, setBoards } = useBoardStore();
  useEffect(() => {
    console.log("mounted");
  });
  const current = currentBoard();
  const { isLoading } = useQuery(["boards"], fetchBoards, {
    staleTime: 1000 * 60 * 5,
    onSuccess: (fetchedBoards: BoardI[]) => {
      setBoards(fetchedBoards);
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
        <Skeleton h={{ base: "600px", md: "400px" }} w="100%"></Skeleton>
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
        >
          {columns
            .filter((col) => col.name)
            .map((column) => (
              <Grid.Col
                key={column.id}
                span={{ base: 10, sm: 8, md: 3 }}
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
