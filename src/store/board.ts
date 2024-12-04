import { create } from 'zustand'
import { Board, Column } from '../components/modal';
import zustymiddlewarets  from 'zustymiddlewarets';
import { devtools } from 'zustand/middleware';

interface BoardInterface {
  currentBoard:Board | null;
  boards: Board[];
  setCurrentBoard: (currentBoardId: Board) => void,
  setBoards: (boards: Board[]) => void;
  addNewColumn: () => void,
  dataLoaded: boolean,
  onDataLoaded: (value: boolean) => void,
  restoreCurrentBoard: (boards: Board[]) => void
} 

export const useBoardStore = create<BoardInterface>()(devtools((set) => ({
  currentBoard: null,
  dataLoaded: false,
  boards: [],
  setBoards(boards: Board[]) {
    set({boards: boards})
  },
  setCurrentBoard(currentBoard: Board) {
    set({currentBoard: currentBoard})
  },
  restoreCurrentBoard(boards: Board[]){
    set((state) => ({
      currentBoard: boards.find((board) => board._id === state.currentBoard?._id) || boards[0],
    }))
  }, 
  addNewColumn: () => {
    set((state) => {
      if (!state.currentBoard) return state;

      const newColumn: Column = {
        name: "",
        tasks: []
      };

      return {
        currentBoard: {
          ...state.currentBoard,
          columns: [...state.currentBoard.columns, newColumn],
        },
      };
    });
  },
  onDataLoaded(value: boolean) {
    set({dataLoaded: value})
  }
})))