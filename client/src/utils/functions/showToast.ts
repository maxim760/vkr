import { toast } from 'svelte-easy-toast';

export const toastEvents = {
  success: (text?: string) => {
    toast({
      type: "success",
      position: "bottom-right",
      text: text ?? '',
      title: 'Успешно'
    })
  },
  info: (text: string) => {
    toast({
      type: "info",
      position: "bottom-right",
      text: text,
      showClose: true
    })
  },
  error: (text?: string) => {
    toast({
      type: "error",
      position: "bottom-right",
      text: text ?? '',
      title: 'Ошибка'
    })
  },
}