import { Box, Chip, colors, darken, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { authApi } from 'src/api/services/auth/authService'
import { Layout } from 'src/components/ui/Layout/layout/Layout'
import { PropertiesCard } from 'src/components/ui/PropertiesCard/PropertiesCard'
import { DateTimeFormatter } from 'src/utils/config/date'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/AddCircle';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useDialog } from 'src/utils/hooks/common/useDialog'
import { EditAddress } from 'src/components/screens/home/dialogs/EditAddress'
import { EditContact } from 'src/components/screens/home/dialogs/EditContact'
import { EditBalance } from 'src/components/screens/home/dialogs/EditBalance'
import { ConfirmDelete } from 'src/components/screens/home/dialogs/ConfirmDelete'
interface IProps {
  
}

enum HomeDialogs {
  Balance,
  Address,
  Contact,
  Delete
}

export const HomePage: React.FC<IProps> = ({ }) => {
  const { isLoading, data, error } = useQuery({ queryFn: authApi.me, queryKey: ["me"] })
  const {dialog, onClose, onOpen} = useDialog<HomeDialogs>()
  const userCardData = useMemo(() => {
    if (!data) {
      return []
    }
    return [
      {
        id: "1",
        title: "Личные данные",
        items: [
          {label: "Имя", value: data.firstName},
          {label: "Фамилия", value: data.lastName},
          {label: "Почта", value: data.email},
          {label: "Телефон", value: data.phone},
        ]
      },
      {
        id: "2",
        title: "Информация об адресе",
        items: [
          {label: "Страна", value: data.address.country},
          {label: "Город", value: data.address.city},
          {label: "Улица", value: data.address.street},
          {label: "Дом", value: data.address.house},
          {label: "Подъезд", value: data.address.entrance},
          {label: "Квартира", value: data.address.flat},
          {label: "Комментарий", value: data.address.commentary},
        ]
      },
      {
        id: "3",
        title: "Дата регистрации",
        items: [
          {label: "Зарегистрирован", value: DateTimeFormatter.format(new Date(data.created_at))},
        ]
      },
    ]
  }, [data])
  return (
    <Layout title="Профиль">
      {isLoading ? <p>loading</p> : (
        <Box maxWidth="sm" sx={{ display: "flex", mx: "auto", mt: "30px" }}>
          <PropertiesCard
            sx={{width: "100%"}}
            title="Профиль"
            groups={userCardData}
          />
        </Box>
      )}
      <Chip
        component="div"
        size='medium'
        sx={{ padding: "4px 4px", userSelect: "auto", borderRadius: "32px", height: "auto", position: "fixed", bottom: 16, left: 16, fontSize: "18px", "& .MuiChip-deleteIcon": {fontSize: "32px", } }}
        deleteIcon={<AddIcon sx={{ fill: colors.green[500], "&:hover": {fill: darken(colors.green[500], 0.1)}  }} />}
        onDelete={onOpen(HomeDialogs.Balance)} // открыть окно пополнения баланса
        label={`Баланс - ${data?.cash || 0}₽`}
      />
      <SpeedDial
        sx={{ position: 'fixed', bottom: 16, right: 16, color: "secondary" }}
        icon={<MoreHorizIcon />}
        ariaLabel='user profile actions'
        FabProps={{ color: "secondary" }}
        
      >
        <SpeedDialAction
          icon={<CloseIcon />}
          sx={theme => ({
            bgcolor: theme.palette.error.main, color: theme.palette.primary.contrastText, "&:hover": {
            bgcolor: darken(theme.palette.error.main, 0.1)
          }})}
          tooltipTitle="Удалить аккаунт"
          color='inherit'
          onClick={onOpen(HomeDialogs.Delete)}
        />
        <SpeedDialAction
          icon={<LocationOnIcon />}
          sx={theme => ({bgcolor: colors.orange[700], color: theme.palette.primary.contrastText, "&:hover": {
            bgcolor: darken(colors.orange[700], 0.1)
          }
          })}
          onClick={onOpen(HomeDialogs.Address)}
          tooltipTitle="Редактировать адрес"
          color="default"
          />
        <SpeedDialAction
          icon={<WalletIcon />}
          sx={theme => ({bgcolor: colors.green[500], color: theme.palette.primary.contrastText, "&:hover": {
            bgcolor: darken(colors.green[500], 0.1)
          }})}
          onClick={onOpen(HomeDialogs.Balance)}
          tooltipTitle="Пополнить баланс"
          color="default"
        />
        <SpeedDialAction
          icon={<EditIcon />}
          sx={theme => ({bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, "&:hover": {
            bgcolor: darken(theme.palette.primary.main, 0.1)
          }})}
          onClick={onOpen(HomeDialogs.Contact)}
          tooltipTitle="Редактировать основную информацию"
        />
      </SpeedDial>
      {dialog === HomeDialogs.Address && (
        <EditAddress
          onClose={onClose}
          open
          address={{
            city: data?.address.city || "",
            commentary: data?.address.commentary || "",
            country: data?.address.country || "",
            entrance: data?.address.entrance || "",
            flat: data?.address.flat,
            house: data?.address.house || "",
            street: data?.address.street || "",
          }}
        />
      )}
      {dialog === HomeDialogs.Contact && (
        <EditContact
          onClose={onClose}
          open
          contact={{
            firstName: data?.firstName || "",
            lastName: data?.lastName || "",
            phone: data?.phone || "",
          }}
        />
      )}
      {dialog === HomeDialogs.Balance && (
        <EditBalance
          onClose={onClose}
          open
        />
      )}
      {dialog === HomeDialogs.Delete && (
        <ConfirmDelete
          onClose={onClose}
          open
        />
      )}
    </Layout>
  )
}