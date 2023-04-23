import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import {FC} from 'react'
import { GithubIcon, GoogleIcon, SlackIcon, VkIcon, YandexIcon } from 'src/assets/icons/SocialIcons'
import { TooltipButton } from 'src/components/ui/TooltipButton/TooltipButton'

type IProps = {
  onClickSocial(path: string): () => void
}

const buttons: { icon: React.ReactNode, apiPath: string, tooltip: string }[] = [
  {icon: <GoogleIcon />, apiPath: "google", tooltip: "Google"},
  {icon: <VkIcon />, apiPath: "vk", tooltip: "Вконтакте"},
  {icon: <YandexIcon />, apiPath: "yandex", tooltip: "Яндекс"},
  {icon: <GithubIcon />, apiPath: "github", tooltip: "GitHub"},
  {icon: <SlackIcon />, apiPath: "slack", tooltip: "Slack"},
]

export const SocialButtons: FC<IProps> = ({onClickSocial}) => {
  
  return (
    <Box display="flex" alignItems="center">
      <Typography>Через соц. сети</Typography>
      <Box display="flex" alignItems="center" sx={{ ml: "24px", "& > *": { ml: "8px" } }}>
        {buttons.map(({ icon, apiPath, tooltip }) => (
          <TooltipButton key={apiPath} onClick={onClickSocial(apiPath)} tooltip={tooltip} size="small">{icon}</TooltipButton>
          
        ))}
      </Box>
    </Box>
  )
}