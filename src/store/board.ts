import { create } from "zustand";
import { Board } from "../components/modal";

interface BoardInterface {
  boards: Board[];
  setCurrentBoardId: (id: string) => void;
  currentBoardId: null | string;
  setBoards: (boards: Board[]) => void;
  dataLoaded: boolean;
  currentBoard: () => Board | undefined;
  updateBoard: (board: Board) => void;
}

export const useBoardStore = create<BoardInterface>()((set, get) => ({
  currentBoardId: null,
  dataLoaded: false,
  boards: [],
  setBoards(boards: Board[]) {
    set({ boards: boards });
  },
  currentBoard: () => {
    const { boards, currentBoardId } = get();
    return boards?.find((board) => board.id === currentBoardId);
  },
  setCurrentBoardId(id: string) {
    set({ currentBoardId: id });
  },
  updateBoard: (updatedBoard: Board) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === updatedBoard.id
          ? { ...updatedBoard, columns: [...updatedBoard.columns] }
          : board,
      ),
    })),
}));
