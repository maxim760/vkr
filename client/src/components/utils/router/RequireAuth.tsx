import {FC, PropsWithChildren} from 'react'
import { Navigate } from 'react-router-dom'
import { RoleTypes } from 'src/api/types/models/User'
import { useAuthStore } from 'src/store/profile/authStore'

type IProps = {
  redirectTo?: string,
  role?: RoleTypes,
}

export const RequireAuth: FC<PropsWithChildren<IProps>> = ({children, role, redirectTo = "/login"}) => {
  const user = useAuthStore(state => state.user)
  const hasRole = !role || user?.roles?.some(item => item.name === role)
  if (user && hasRole) {
    return <>{children}</>
  }
  return <Navigate replace to={redirectTo} />
}