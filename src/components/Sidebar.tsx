import { Button, NavLink, Text, Box, Flex } from "@mantine/core";
import {
  IconLayoutBoardSplit,
  IconPlus,
  IconEyeOff,
} from "@tabler/icons-react";
import { useBoardStore } from "../store/board";
import { useState } from "react";
import { fetchBoards } from "../api";
import { useQuery } from "react-query";
import { Board } from "./modal";
import EditBoardWrapper from "./EditBoardWrapper";

function Sidebar({
  toggleDesktop,
  toggleMobile,
}: {
  toggleDesktop: () => void;
  toggleMobile: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const { data: boards = [] } = useQuery<Board[]>("boards", fetchBoards);
  const { currentBoard, setCurrentBoard } = useBoardStore();

  const switchBoard = (board: Board) => {
    setCurrentBoard(board);
  };
  return (
    <Box pos="relative" h="100%">
      <Text fw="600" size="xl" px="12" py="16">
        kanban
      </Text>
      <Text fw="500" size="sm" px="12" py="4" c="">
        ALL BOARDS ({boards.length})
      </Text>

      {boards.map((board) => {
        return (
          <NavLink
            key={board.id}
            active={board?.id === currentBoard?.id}
            onClick={() => switchBoard(board)}
            leftSection={<IconLayoutBoardSplit size={20} />}
            label={board.name}
          />
        );
      })}

      <Button
        onClick={() => setOpened(true)}
        variant="transparent"
        leftSection={<IconLayoutBoardSplit size={20} />}
      >
        <IconPlus size={16} />
        Create New Board
      </Button>
      {opened && <EditBoardWrapper closeModal={setOpened} isEdit={false} />}
      <Flex
        visibleFrom="md"
        align="center"
        pos="absolute"
        left={0}
        bottom="200px"
        px={12}
      >
        <Button onClick={() => toggleDesktop()}>
          <IconEyeOff size={20} />{" "}
          <span style={{ marginLeft: "5px" }}>Hide Sidebar</span>
        </Button>
      </Flex>
      <Flex
        hiddenFrom="md"
        align="center"
        pos="absolute"
        left="0"
        bottom="200px"
        px={12}
      >
        <Button onClick={() => toggleMobile()}>
          <IconEyeOff size={20} />{" "}
          <span style={{ marginLeft: "5px" }}>Hide Sidebar</span>
        </Button>
      </Flex>
    </Box>
  );
}

export default Sidebar;
