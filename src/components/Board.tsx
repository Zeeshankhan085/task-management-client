import { useBoardStore } from '../store/board';
import { Center, Text, Grid, ScrollArea } from '@mantine/core';
// import { useListState } from '@mantine/hooks';
import { useQuery, } from 'react-query';
import { fetchBoards } from '../api';
import Column from './Column';
import AddNewColumn from "./AddNewColumn"
// import { DragEndEvent, DragStartEvent, } from '@dnd-kit/core';

function Board() {
  const { boards, currentBoard, setCurrentBoard, setBoards } = useBoardStore();

  const { isLoading } = useQuery(['boards'], fetchBoards, {
    onSuccess: (fetchedBoards) => {
      // Set boards in Zustand store
      setBoards(fetchedBoards);
      // Set the first board as current only if it's the initial load
      if (!boards.length && fetchedBoards.length > 0) {
        setCurrentBoard(fetchedBoards[0]);
      }
    },
  });

  // const queryClient = useQueryClient()
  // const mutation = useMutation({
  //   mutationFn: moveTask,
  //   onSuccess: () => {

  //     // Invalidate and refetch boards after a successful mutation
  //     queryClient.invalidateQueries('boards');

  //   },
  // });
  const columns = currentBoard?.columns ?? []
  // const [activeTaskId, setActiveTaskId] = useState<null | string>(null)


  // const onDragEnd = ({ active, over }: DragEndEvent) => {
  //   console.log(active, over);
  //   const sourceColumnId = active.data.current?.sortable.containerId
  //   const targetColumnId = over?.data.current?.sortable.containerId
  //   const taskId = active.id
  //   if (sourceColumnId && targetColumnId) {
  //     const findSourceColumn = currentBoard?.columns.find(col => col._id === sourceColumnId)
  //     const findTargetColumn = currentBoard?.columns.find(col => col._id === targetColumnId);
  //     if (findSourceColumn && findTargetColumn) {
  //       const task = getTaskById(taskId as string);
  //       findSourceColumn.tasks = findSourceColumn.tasks.filter(task => task._id !== taskId)
  //       findTargetColumn.tasks.push(task)
  //       mutation.mutate({ boardId: currentBoard?._id, taskId, sourceColumnId, targetColumnId })
  //     }
  //   }

  // };

  // const [state, handlers] = useListState(columns);
  if (isLoading) return <Center mih="100%"><Text>Loading...</Text></Center>;
  // const getTaskById = (taskId: string) => {
  //   return currentBoard?.columns.reduce((foundTask, col) => {
  //     return foundTask || col.tasks.find(task => task._id === taskId);
  //   }, null);
  // };


  // const onDragStart = ({ active }: DragStartEvent) => {
  //   setActiveTaskId(active.id as string)
  // }
  // const task = activeTaskId ? getTaskById(activeTaskId) : null;


  return (
    <>
      <ScrollArea
        scrollbars="x"
        type="never"

        styles={{
          root: {
            maxWidth: "100%", // Restrict to parent container
            overflowX: 'auto',
          },
          viewport: {
            width: '100%',     // Prevent viewport from exceeding container
            padding: 0,        // Remove padding on viewport
          },
        }}
      >
        <Grid
          styles={{
            inner: {
              display: 'flex',
              flexWrap: 'nowrap',       // Prevent wrapping
              // width: 'fit-content',    // Match content size
            },
          }}
        // h="100%"
        >
          {columns
            .filter((col) => col.name)
            .map((column) => (
              <Grid.Col
                key={column._id}
                span={{ base: 4, md: 3, lg: 2 }}
                style={{
                  flex: '0 0 auto',
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

export default Board



