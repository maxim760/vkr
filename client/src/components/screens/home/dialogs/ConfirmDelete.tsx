import { useMutation } from '@tanstack/react-query'
import { FC } from 'react'
import { authApi } from 'src/api/services/auth/authService'
import { ConfirmDialog } from 'src/components/utils/dialogs/ConfirmDialog'
import { useAuthStore } from 'src/store/profile/authStore'
import { DialogProps } from 'src/utils/types/types'

type IProps = {
} & DialogProps

export const ConfirmDelete: FC<IProps> = ({ onClose, open }) => {
  const clearUser = useAuthStore(state => state.clearUser)
  const { mutate, isLoading } = useMutation({
    mutationFn: authApi.deleteAccount,
    onSuccess: () => {
      onClose()
    },
  })

  const onSubmit = () => {
    mutate()
    clearUser()
  }
  return (
    <ConfirmDialog
      onClose={onClose}
      open={open}
      title="Удаление аккаунта"
      isLoading={isLoading}
      onSubmit={onSubmit}
    />
  )
}
