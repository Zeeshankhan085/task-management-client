import { AppShell, Box, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Board from "./components/Board";
import { IconEye } from "@tabler/icons-react";

export default function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        layout="alt"
        navbar={{
          width: 200,
          breakpoint: "md",
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
      >
        <AppShell.Header style={{ maxWidth: "100%" }}>
          <Header />
        </AppShell.Header>

        <AppShell.Navbar>
          <Sidebar toggleDesktop={toggleDesktop} toggleMobile={toggleMobile} />
        </AppShell.Navbar>

        <AppShell.Main>
          <Board />
        </AppShell.Main>
      </AppShell>
      <Box pos="absolute" left={0} bottom="200px" hiddenFrom="md">
        {/* <IconEye /> */}
        <ActionIcon
          w="50px"
          h="25px"
          onClick={toggleMobile}
          style={{
            borderRadius: 0,
            borderTopRightRadius: "10px", // Adjust the value as needed
            borderBottomRightRadius: "10px",
          }}
        >
          <IconEye />
        </ActionIcon>
      </Box>
      <Box pos="absolute" left={0} bottom="200px" visibleFrom="md">
        {/* <IconEye /> */}
        <ActionIcon
          w="50px"
          h="25px"
          onClick={toggleDesktop}
          style={{
            borderRadius: 0,
            borderTopRightRadius: "10px", // Adjust the value as needed
            borderBottomRightRadius: "10px",
          }}
        >
          <IconEye />
        </ActionIcon>
      </Box>
    </>
  );
}
