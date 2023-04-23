import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { authApi } from 'src/api/services/auth/authService'
import { EditUserBalanceDto } from 'src/api/services/auth/dto'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { Input } from 'src/components/ui/form/Input'
import { useAuthStore } from 'src/store/profile/authStore'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { DialogProps } from 'src/utils/types/types'

const getValidationSchema = () =>
  getSchema<{}>({})

type IProps = {
} & DialogProps

export const ConfirmDelete: FC<IProps> = ({ onClose, open }) => {
  const clearUser = useAuthStore(state => state.clearUser)
  // const queryClient = useQueryClient()
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: authApi.deleteAccount,
    onSuccess: () => {
      onClose()
    },
  })

  const methods = useForm<EditUserBalanceDto>({
    resolver: yupResolver(getValidationSchema()),
  })
  const { handleSubmit } = methods
  const onSubmit = () => {
    mutateAsync()
    clearUser()
  }
  return (
    <AppDialog onClose={onClose} open={open} title="Удаление аккаунта">
      <FormProvider {...methods}>
        <Grid
          container
          component="form"
          spacing={1}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid item xs={12}>
            <Typography fontWeight={600}>Вы уверены?</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex">
              {!!onClose && (
                <CloseButton
                  onClick={onClose}
                  sx={{ mt: 1, ml: 'auto', display: 'flex', mr: 1 }}
                />
              )}
              <SaveButton
                type="submit"
                sx={{
                  mt: 1,
                  mx: !onClose ? 'auto' : undefined,
                  display: 'flex',
                }}
                loading={isLoading}
              />
            </Box>
          </Grid>
        </Grid>
      </FormProvider>
    </AppDialog>
  )
}
