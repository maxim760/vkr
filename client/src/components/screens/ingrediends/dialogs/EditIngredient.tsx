import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { EditProductDto } from 'src/api/services/product/dto'
import { productApi } from 'src/api/services/product/productService'
import { IProduct } from 'src/api/services/product/response'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { Input } from 'src/components/ui/form/Input'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { DialogProps } from 'src/utils/types/types'

type EditProduct = Omit<EditProductDto, "id">

const getValidationSchema = () =>
  getSchema<EditProduct>({
    count: FormFields.RequiredNumberPositive,
    name: FormFields.RequiredStr
  })

type IProps = {
  id: string,
  product?: IProduct
} & DialogProps

export const EditIngredient: FC<IProps> = ({ onClose, open, id, product }) => {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation({
    mutationFn: productApi.edit,
    onSuccess: () => {
      queryClient.invalidateQueries(["ingredients"])
      onClose()
    },
  })

  const methods = useForm<EditProduct>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {count: product?.count , name: product?.name || ""},
  })
  const { handleSubmit } = methods
  const onSubmit = (data: EditProduct) => {
    mutate({id, ...data})
  }
  return (
    <AppDialog onClose={onClose} open={open} title="Измените ингредиент" maxWidth="xs" fullWidth>
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
