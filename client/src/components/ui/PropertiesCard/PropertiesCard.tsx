import { Box, Paper, PaperProps, Typography } from '@mui/material'
import { group } from 'console'
import React, {FC} from 'react'

type IGroup = {
  id: string,
  title?: string,
  items: {label: string, value: string | number}[]
}

type IProps = {
  title: string,
  groups: IGroup[]
}

export const PropertiesCard: FC<IProps & PaperProps> = ({title, groups, ...paperProps}) => {
  
  return (
    <Paper sx={{p: "16px", ...paperProps.sx}}>
      <Typography sx={{mb: "12px"}} fontSize={24} fontWeight={700}>{title}</Typography>
      <Box>
        {groups.map((group) => (
          <React.Fragment key={group.id}>
            {!!group.title && <Typography fontSize={16} fontWeight={700} sx={{ p: "16px 0 8px" }}>{group.title}</Typography>}
            {group.items.map(({ label, value }) => (
              <Box
                key={label}
                display="grid"
                alignItems="center"
                sx={(theme) => ({
                  gridTemplateColumns: "1fr 1fr",
                  [theme.breakpoints.down("md")]: {
                    gap: "8px",
                    padding: "9px 12px",
                    "&:nth-of-type(2n)": {
                      bgcolor: "#f7f7f7"
                    }
                  },
                  [theme.breakpoints.up("md")]: {
                    gap: "16px",
                    padding: 0,
                    "& + &": { mt: "8px" },
                  },
                })}
              >
                <Typography sx={{ borderBottom: { md: "1px dotted #ddd" }}}>{label}</Typography>
                <Typography>{value}</Typography>
              </Box>
            ))}
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  )
}