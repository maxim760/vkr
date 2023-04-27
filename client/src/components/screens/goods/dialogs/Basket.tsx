import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { CreateGoodsDto } from 'src/api/services/goods/dto'
import { goodsApi } from 'src/api/services/goods/goodsService'
import { productApi } from 'src/api/services/product/productService'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { FormComplete } from 'src/components/ui/form/FormComplete'
import { Input } from 'src/components/ui/form/Input'
import { MultilineInput } from 'src/components/ui/form/MultilineInput'
import { PhoneInput } from 'src/components/ui/form/PhoneInput'
import { selectBasket, selectBasketActions, selectBasketTotal, useBasketStore } from 'src/store/order/basketStore'
import { CurrencyFormatter } from 'src/utils/config/formatters'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { DialogProps, IComplete } from 'src/utils/types/types'
import { BasketActions } from '../BasketActions'
const deliveryCost = +process.env.REACT_APP_DELIVERY_COST
type IProps = {
} & DialogProps

export const Basket: FC<IProps> = ({ onClose, open }) => {
  const basket = useBasketStore(selectBasket)
  const totalPrice = useBasketStore(selectBasketTotal)
  const actions = useBasketStore(selectBasketActions)
  const { mutateAsync, isLoading, data, error } = useMutation({
    mutationFn: goodsApi.create,
    onSuccess: () => {
      onClose()
    },
  })

  const onSubmit = () => {
    console.log({basket})
  }
  return (
    <AppDialog onClose={onClose} open={open} title="Корзина" maxWidth="sm" fullWidth>
      <Grid
        container
        spacing={1}
      >
        {Object.values(basket).map((basketItem, i, arr) => {
          const { item, count } = basketItem
          return (
            <Grid item key={item.id}>
              <Box sx={{px: 2, py: 1, display: "flex", flexDirection: "column", borderBottom: "1px solid", borderColor: i === arr.length - 1 ? "transparent" : "divider"}}>
                <Box sx={{ display: "flex", gap: 1, mb: 2, flexDirection: {xs: "column", sm: "row"} }}>
                  <Box sx={{
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    "& img": {
                      aspectRatio: 1,
                      height: 60,
                      width: 60,
                      borderRadius: 1
                  }}}>
                    <img src={item.img} alt={item.name} width={60} height={60}  />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontSize="1rem">{item.name}</Typography>
                    <Typography fontSize="0.75rem" sx={{
                      color: "text.light",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      display: "-webkit-box",
                      "-webkit-line-clamp": "3",
                      "-webkit-box-orient": "vertical"
                    }}>{item.description}</Typography>
                  </Box>
                  <Box>
                    <Typography fontSize="1.125rem" fontWeight={600}>{CurrencyFormatter.format(item.currentPrice * count)}</Typography>
                    {count > 1 && <Typography fontSize="0.75rem" sx={{color: "text.light"}}>{CurrencyFormatter.format(item.currentPrice)} / шт.</Typography>}
                  </Box>
                </Box>
                <BasketActions actions={actions} basketItem={basketItem} item={basketItem.item} />
              </Box>
            </Grid>
          )
        })}

        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked />} label={`Доставка (${CurrencyFormatter.format(deliveryCost)})`} />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize="1.25rem">Итого: <b>{CurrencyFormatter.format(totalPrice)}</b></Typography>
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
    </AppDialog>
  )
}
