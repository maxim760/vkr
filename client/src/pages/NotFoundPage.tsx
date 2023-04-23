import React from 'react'
import { Layout } from 'src/components/ui/Layout/layout/Layout'

interface IProps {
  
}

export const NotFoundPage: React.FC<IProps> = ({}) => {
  
  return (
    <Layout title="404">
      not found
    </Layout>
  )
}