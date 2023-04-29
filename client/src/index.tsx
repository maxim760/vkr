import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Backdrop, Button, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { ruRU } from '@mui/material/locale';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getErrorMessage } from './utils/config/config';

if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
  console.warn = () => {}
}

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
}, ruRU)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    },
    mutations: {
      onError: (e) => toast.error(getErrorMessage(e, "Неизвестная ошибка"))
    }
  },
})


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <ToastContainer autoClose={2000} position="bottom-left" hideProgressBar pauseOnHover closeOnClick pauseOnFocusLoss={false} />
    </ThemeProvider>
  </QueryClientProvider>
);