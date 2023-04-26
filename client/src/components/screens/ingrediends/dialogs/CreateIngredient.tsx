import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { authApi } from 'src/api/services/auth/authService'
import { certificateApi } from 'src/api/services/certificate/certificateService'
import { CreateCertDto } from 'src/api/services/certificate/dto'
import { CreateProductDto, EditProductDto } from 'src/api/services/product/dto'
import { productApi } from 'src/api/services/product/productService'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { Input } from 'src/components/ui/form/Input'
import { useAuthStore } from 'src/store/profile/authStore'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { DialogProps } from 'src/utils/types/types'

const getValidationSchema = () =>
  getSchema<CreateProductDto>({
    count: FormFields.RequiredNumberPositive,
    name: FormFields.RequiredStr
  })

type IProps = {
} & DialogProps

export const CreateIngredient: FC<IProps> = ({ onClose, open }) => {
  const user = useAuthStore(state => state.user)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["ingredients"])
      onClose()
    },
  })

  const methods = useForm<CreateProductDto>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {count: undefined, name: ""},
  })
  const { handleSubmit } = methods
  const onSubmit = (data: CreateProductDto) => {
    mutateAsync(data)
  }
  return (
    <AppDialog onClose={onClose} open={open} title="Создайте ингредиент" maxWidth="xs" fullWidth>
      <FormProvider {...methods}>
        <Grid
          container
          component="form"
          spacing={1}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid item xs={12}>
            <Input autoFocus label="Название" name="name" />
          </Grid>
          <Grid item xs={12}>
            <Input label="Количество" name="count" type="number" />
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
