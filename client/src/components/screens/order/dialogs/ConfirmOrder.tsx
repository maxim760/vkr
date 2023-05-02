import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { orderApi } from 'src/api/services/order/orderService'
import { ConfirmDialog } from 'src/components/utils/dialogs/ConfirmDialog'
import { DialogProps } from 'src/utils/types/types'

type IProps = {
  id: string,
  invalidateQuery: string
} & DialogProps

export const ConfirmOrder: FC<IProps> = ({ onClose, open, id, invalidateQuery }) => {
  const queryClient = useQueryClient()
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: orderApi.confirm,
    onSuccess: () => {
      queryClient.invalidateQueries([invalidateQuery])
      onClose()
    },
  })
  const onSubmit = () => {
    mutateAsync({id})
  }
  return (
    <ConfirmDialog
      onClose={onClose}
      open={open}
      title="Подтвердить получение"
      isLoading={isLoading}
      onSubmit={onSubmit}
    />
  )
}
