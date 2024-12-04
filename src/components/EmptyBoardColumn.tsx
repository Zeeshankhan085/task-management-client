import { Box, Center, Text } from '@mantine/core'
import React from 'react'

function EmptyBoardColumn() {
  return (
    <Box w="100%" h="calc(100vh-60px)">
      <Center>
        <Text>This board is empty. Chuyihuiuhireate a new column to get started</Text>

      </Center>
    </Box>
  )
}

export default EmptyBoardColumn