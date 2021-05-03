import React, { FC } from 'react'
import { Box, Text } from '@chakra-ui/react'

export type CreateItemProps = {
  value: string
}

export const CreateItem: FC<CreateItemProps> = ({ value }) => {
  return (
    <Text>
      <Box as='span'>Create</Box>{' '}
      <Box as='span' bg='yellow.300' fontWeight='bold'>
        "{value}"
      </Box>
    </Text>
  )
}
