import { create } from "zustand";
import { Board } from "../components/modal";

interface BoardInterface {
  boards: Board[];
  setCurrentBoardid: (id: string) => void;
  currentBoardId: null | string;
  setBoards: (boards: Board[]) => void;
  dataLoaded: boolean;
  currentBoard: () => Board | undefined;
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
    return boards.find((board) => board.id === currentBoardId);
  },
  setCurrentBoardId(id: string) {
    set({ currentBoardId: id });
  },
  // addNewColumn: () => {
  //   set((state) => {
  //     if (!state.currentBoard) return state;

  //     const newColumn: Column = {
  //       name: "",
  //       tasks: [],
  //     };

  //     return {
  //       currentBoard: {
  //         ...state.currentBoard,
  //         columns: [...state.currentBoard.columns, newColumn],
  //       },
  //     };
  //   });
  // },
}));
