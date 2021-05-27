import React, { FC } from 'react'
import { Box, List, ListProps } from '@chakra-ui/react'

export const MenuList: FC<ListProps> = (props) => {
  return (
    <Box pb={4} mb={4}>
      <List
        bg='white'
        borderRadius='4px'
        boxShadow='6px 5px 8px rgba(0,50,30,0.02)'
        {...props}
      />
    </Box>
  )
}
