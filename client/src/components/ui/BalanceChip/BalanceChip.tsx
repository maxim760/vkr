import {FC} from 'react'
import { useAuthStore } from 'src/store/profile/authStore'
import {
  Box,
  Chip,
  colors,
  darken,
  Skeleton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material'
import { CurrencyFormatter } from 'src/utils/config/formatters'
import AddIcon from '@mui/icons-material/AddCircle'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from 'src/utils/config/query/constants'
import { authApi } from 'src/api/services/auth/authService'
import { toast } from 'react-toastify'
import { hasOnlyData } from 'src/utils/config/config'

type IProps = {
  onClick?: () => void
}

export const BalanceChip: FC<IProps> = ({onClick}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKeys.Balance],
    queryFn: () => authApi.getBalance(),
    onError: () => toast.error("Ошибка при получении баланса")
  })
  const label = isLoading
    ? <Skeleton width="180px" />
    : hasOnlyData(data, {isLoading, error})
      ? `Баланс - ${CurrencyFormatter.format(data.balance)}`
      : null
  return (
    <Chip
      component="div"
      size="medium"
      sx={{
        padding: '4px 4px',
        userSelect: 'auto',
        borderRadius: '32px',
        height: 'auto',
        position: 'fixed',
        bottom: 16,
        left: 16,
        fontSize: '18px',
        '& .MuiChip-deleteIcon': { fontSize: '32px' },
      }}
      deleteIcon={!!onClick ? (
        <AddIcon
          sx={{
            fill: colors.green[500],
            '&:hover': { fill: darken(colors.green[500], 0.1) },
          }}
        />
      ) : undefined}
      onDelete={onClick}
      label={label}
    />
  )
}