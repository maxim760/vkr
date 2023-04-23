import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Backdrop, Button, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const theme = createTheme({
  palette: {
    primary: {
      main: "#0088cc"
    },
    background: {
      default: "#f8f8f8"
    }
  },

  components: {
    MuiAppBar: {
      defaultProps: {
        color: "transparent",
      },
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff75",
          backdropFilter: "blur(20px)"
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        dense: {
          height: "48px",
          minHeight: "48px"
        }
      }
    },
    MuiDialog: {
      defaultProps: {
        scroll: "body",
        slotProps: {
          backdrop: {
            sx: {
              backgroundColor: "#ffffff75",
              backdropFilter: "blur(20px)"
            }
          }
        }
      },
      styleOverrides: {
        paper: {
          boxShadow: "none",
          border: "1px solid #bbb"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none"
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        size: "small"
      }
    },
    MuiLink: {
      defaultProps: {
        underline: "hover"
      }
    },
    MuiPaper: {
      defaultProps: {
        variant: "outlined"
      }
    }
  }
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
    </QueryClientProvider>
);