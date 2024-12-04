import { AppShell, Button, Box, em, AppShellNavbar, ActionIcon, ScrollArea } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Board from './components/Board';
import { useEffect } from 'react';
import { useBoardStore } from './store/board';
import { getLocalStorage, storeLocalStorage } from './utils/localStorage';
import { boardsData } from './data';
import { IconEye } from '@tabler/icons-react'
import { useState } from 'react';


export default function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [opened, setOpened] = useState(false);
  const [desktopOpened, { toggle: toggleDesktop }] =
    useDisclosure(true);
  const isTablet =
    useMediaQuery('(min-width: 768px) and (max-width: 1200px)');

  return (
    <>
      <AppShell
        padding="md"
        header={{ height: 60, }}
        layout='alt'
        navbar={{
          width: 200,
          breakpoint: 'md',
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },

        }}
      >
        <AppShell.Header style={{ maxWidth: '100%' }}><Header /></AppShell.Header>
        {/* {isTablet ? <Box>
        <Button leftSection={<IconEye size={16} />} onClick={toggleMobile} hiddenFrom="sm" />

      </Box> : <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>} */}

        <AppShell.Navbar>
          <Sidebar toggleDesktop={toggleDesktop} toggleMobile={toggleMobile} />
        </AppShell.Navbar>

        <AppShell.Main>
          {/* <Button onClick={toggleDesktop} visibleFrom="sm">
          Toggle navbar
        </Button>
        <Button onClick={toggleMobile} hiddenFrom="sm">
          Toggle navbar
        </Button> */}
          <Board />
        </AppShell.Main>
      </AppShell>
      <Box pos="absolute" left={0} bottom="200px" hiddenFrom='md'>
        {/* <IconEye /> */}
        <ActionIcon w="50px" h="25px" onClick={toggleMobile} style={{
          borderRadius: 0,
          borderTopRightRadius: '10px', // Adjust the value as needed
          borderBottomRightRadius: '10px',
        }}>
          <IconEye />
        </ActionIcon>
      </Box>
      <Box pos="absolute" left={0} bottom="200px" visibleFrom='md'>
        {/* <IconEye /> */}
        <ActionIcon w="50px" h="25px" onClick={toggleDesktop} style={{
          borderRadius: 0,
          borderTopRightRadius: '10px', // Adjust the value as needed
          borderBottomRightRadius: '10px',
        }}>
          <IconEye />
        </ActionIcon>
      </Box>
    </>
  );
}