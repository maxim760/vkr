import { Box, ButtonGroup, Grid, Typography } from '@mui/material'
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
import { IProduct, IProductsResponse } from 'src/api/services/product/response'
import { IGoods, IGoodsResponse } from 'src/api/services/goods/response'
import { goodsApi } from 'src/api/services/goods/goodsService'
import { GetGoodsDto } from 'src/api/services/goods/dto'
import { CurrencyFormatter } from 'src/utils/config/formatters'
import { CreateGoods } from 'src/components/screens/goods/dialogs/CreateGoods'
import { useMenuSearch } from 'src/utils/hooks/menu/useMenuSearch'
import { SearchBar } from 'src/components/screens/menu/SearchBar'
import { GoodsCard } from 'src/components/screens/goods/GoodsCard'
import { EditGoodsItem } from 'src/components/screens/goods/dialogs/EditGoodsItem'
import { EditDiscount } from 'src/components/screens/goods/dialogs/EditDiscount'
import { EditProducts } from 'src/components/screens/goods/dialogs/EditProducts'

interface IProps {
  
}


enum Dialogs {
  Create = "create",
  EditItem = "edit-item",
  EditDiscount = "edit-discount",
  EditProducts = "edit-products",
}
type IDialog = {
  type: Dialogs,
  value: string,
  item?: IGoodsResponse
}

const getValidationSchema = () =>
  getSchema<GetGoodsDto>({
    query: FormFields.Str,
    min: FormFields.Number,
    max: FormFields.Number,
  })

const invalidateQuery = "goods"

export const GoodsPage: React.FC<IProps> = ({ }) => {
  const { dialog, onClose, onOpen } = useDialog<IDialog>()
  const {methods, queryData, invalidateQuery} = useMenuSearch()
  const {isLoading, data, error, isRefetching, refetch} = queryData
  const {handleSubmit, watch} = methods
  const navigate = useNavigate()
  const dialogProps = {
    item: dialog?.item,
    id: dialog?.value || "",
    onClose: onClose,
    invalidateQuery,
    open: true
  } as const
  console.log({data})
  return (
    <Layout title="Блюда">
      {isLoading && <Loader />}
      {!!error && <ErrorMessage error={error} />}
      {!!hasOnlyData(data, { isLoading, error }) && (
        <>
          <Actions>
            <AppButton noMargin onClick={onOpen({type: Dialogs.Create, value: ""})}>Добавить новое блюдо</AppButton>
          </Actions>
          <SearchBar refetch={refetch} methods={methods} />
          <Grid container spacing={2} sx={{my: 2, alignItems: "stretch"}}>
            {isRefetching ? <Loader /> : (
              <>
                {data.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}> 
                    <GoodsCard item={item} showCount>
                      <Actions title="Изменить" sx={{p: 0}}>
                        <AppButton variant="outlined" size="small" onClick={onOpen({value: item.id, type: Dialogs.EditItem, item})} noMargin>Блюдо</AppButton>
                        <AppButton variant="outlined" size="small" onClick={onOpen({value: item.id, type: Dialogs.EditDiscount, item})} noMargin>Скидку</AppButton>
                        <AppButton variant="outlined" size="small" onClick={onOpen({value: item.id, type: Dialogs.EditProducts, item})} noMargin>Состав</AppButton>
                      </Actions>
                    </GoodsCard>
                  </Grid>
                ))}
                {!data.length && (
                  <Grid item sx={{mx: "auto", mt: 4}}>
                    <Typography fontWeight={400} fontSize={"1.25rem"}>Блюд не найдено</Typography>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </>
      )}
      {dialog?.type === Dialogs.Create && <CreateGoods invalidateQuery={invalidateQuery} onClose={onClose} open/>}
      {dialog?.type === Dialogs.EditItem && <EditGoodsItem  {...dialogProps} />}
      {dialog?.type === Dialogs.EditDiscount && <EditDiscount {...dialogProps} />}
      {dialog?.type === Dialogs.EditProducts && <EditProducts {...dialogProps} />}
    </Layout>
  )
}