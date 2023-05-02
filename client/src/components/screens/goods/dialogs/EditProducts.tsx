import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { EditGoodsProductsDto } from 'src/api/services/goods/dto'
import { goodsApi } from 'src/api/services/goods/goodsService'
import { IGoods } from 'src/api/services/goods/response'
import { productApi } from 'src/api/services/product/productService'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { FormComplete } from 'src/components/ui/form/FormComplete'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { DialogProps, IComplete } from 'src/utils/types/types'

type EditGoodsProducts = Omit<EditGoodsProductsDto, "id" | "products"> & {products: IComplete[]}

const getValidationSchema = () =>
  getSchema<EditGoodsProducts>({
    products: FormFields.RequiredCompleteMultiple
  })

type IProps = {
  invalidateQuery: string,
  id: string
  item?: IGoods
} & DialogProps

export const EditProducts: FC<IProps> = ({ onClose, open, invalidateQuery, item, id }) => {
  const { isLoading: ingrediendsLoading,data: ingrediends } = useQuery({
    queryFn: productApi.get,
    queryKey: ["ingredients"],
    onError: () => toast.error("Не загружены ингредиенты")
  })
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation({
    mutationFn: goodsApi.editProducts,
    onSuccess: () => {
      queryClient.invalidateQueries([invalidateQuery])
      onClose()
    },
  })
  const defaultProducts: IComplete[] = (item?.products || []).map(item => ({label: item.name, id: item.id}))
  const methods = useForm<EditGoodsProducts>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {products: defaultProducts},
  })
  const { handleSubmit } = methods
  const onSubmit = (data: EditGoodsProducts) => {
    const {products, ...other} = data
    mutate({...other, id, products: products.map(item => item.id)})
  }
  const options: IComplete[] = (ingrediends || [])?.map(item => ({
    id: item.id,
    label: item.name
  }))
  return (
    <AppDialog onClose={onClose} open={open} title="Измените состав" maxWidth="md" fullWidth>
      <FormProvider {...methods}>
        <Grid
          container
          component="form"
          spacing={1}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid item xs={12}>
            <FormComplete autoFocus name='products' label='Ингредиенты' options={options} multiple loading={ingrediendsLoading}   />
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
