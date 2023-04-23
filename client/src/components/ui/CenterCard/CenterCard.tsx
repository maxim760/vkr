import { Box, Paper } from '@mui/material'
import {FC, PropsWithChildren} from 'react'

type IProps = {
  
}

export const CenterCard: FC<PropsWithChildren<IProps>> = ({children}) => {
  
  return (
    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: "100%", minHeight: "100%"}}>
      <Paper sx={{p: "12px 16px", display: "flex", flexDirection: "column"}}>{children}</Paper>
    </Box>
  )
}