import { Container, Toolbar } from '@mui/material'
import {FC, PropsWithChildren} from 'react'
import { useTitle } from 'src/utils/hooks/common/useTitle'
import { Header } from '../header/Header'

type IProps = {
  hideHeader?: boolean,
  title: string,
}

export const Layout: FC<PropsWithChildren<IProps>> = ({children, hideHeader, title}) => {
  useTitle(title)
  return (
    <>
      {!hideHeader && <Header />}
      <Container component="main" sx={{py: "8px"}}>  
        {!hideHeader && <Toolbar variant='dense' />}
        {children}
      </Container>
    </>
  )
}