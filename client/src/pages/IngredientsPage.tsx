import { Grid, Typography } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { authApi } from 'src/api/services/auth/authService'
import { FindUsersDto } from 'src/api/services/auth/dto'
import { Layout } from 'src/components/ui/Layout/layout/Layout'
import { PropertiesCard } from 'src/components/ui/PropertiesCard/PropertiesCard'
import { ErrorMessage } from 'src/components/ui/statuses/ErrorMessage'
import { Loader } from 'src/components/ui/statuses/Loader'
import { TooltipButton } from 'src/components/ui/TooltipButton/TooltipButton'
import { hasOnlyData } from 'src/utils/config/config'
import { FormFields, getSchema } from 'src/utils/config/forms'
import SearchIcon from '@mui/icons-material/Search';
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'src/components/ui/form/Input'
import { AppButton } from 'src/components/ui/buttons/AppButton'
import { useDialog } from 'src/utils/hooks/common/useDialog'
import { GiftCertificate } from 'src/components/screens/certificate/dialogs/GiftCertificate'
import { useNavigate } from 'react-router-dom'
import { BalanceChip } from 'src/components/ui/BalanceChip/BalanceChip'
import { productApi } from 'src/api/services/product/productService'
import { Actions } from 'src/components/ui/Actions/Actions'
import { CreateIngredient } from 'src/components/screens/ingrediends/dialogs/CreateIngredient'
import { EditIngredient } from 'src/components/screens/ingrediends/dialogs/EditIngredient'
import { IProduct } from 'src/api/services/product/response'

interface IProps {
  
}


enum IngrDialogs {
  Create = "create",
  Edit = "edit"
}
type IDialog = {
  type: IngrDialogs,
  value: string,
  product?: IProduct
}

export const IngredientsPage: React.FC<IProps> = ({ }) => {
  const {dialog, onClose, onOpen} = useDialog<IDialog>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isLoading, data, error } = useQuery({
    queryFn: productApi.get,
    queryKey: ["ingredients"],
  })
  return (
    <Layout title="Ингредиенты">
      {isLoading && <Loader />}
      {!!error && <ErrorMessage error={error} />}
      {!!hasOnlyData(data, { isLoading, error }) && (
        <>
          <Actions>
            <AppButton noMargin onClick={onOpen({type: IngrDialogs.Create, value: ""})}>Добавить новый ингредиент</AppButton>
          </Actions>
          <Grid container spacing={2} sx={{my: 2}}>
            {data.map((item) => (
              <Grid item xs={12} sm={4} md={3} lg={2} key={item.id}> 
                <PropertiesCard
                  sx={{height: "100%"}}
                  small
                  title={item.name}
                  subTitle
                  groups={[
                    {
                      id: item.id,
                      items: [
                        {label: "Кол-во", value: item.count},
                      ]
                    }
                  ]}
                >
                  <AppButton onClick={onOpen({value: item.id, type: IngrDialogs.Edit, product: item})} noMargin>Изменить</AppButton>
                </PropertiesCard>
              </Grid>
            ))}
            {!data.length && (
              <Grid item sx={{mx: "auto", mt: 4}}>
                <Typography fontWeight={400} fontSize={"1.25rem"}>Ингредиентов не найдено</Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}
      {dialog?.type === IngrDialogs.Create && <CreateIngredient onClose={onClose} open/>}
      {dialog?.type === IngrDialogs.Edit && <EditIngredient product={dialog.product} id={dialog.value} onClose={onClose} open/>}
    </Layout>
  )
}