import { IGoods } from "src/api/services/goods/response";
import { create } from "zustand";

export type IBasketItem = {
  count: number,
  item: IGoods
}

export type IBasketStore = {
  basket: {
    [id: string]: IBasketItem
  },
  plusItem(id: string): void,
  minusItem(id: string): void,
  addItem(item: IGoods): void,
  clear(): void,
  computed: {
    totalPrice: number
  }
}

export const selectBasket = (state: IBasketStore) => state.basket
export const selectBasketTotal = (state: IBasketStore) => state.computed.totalPrice
export const selectBasketActions = ({basket, ...actions}: IBasketStore) => actions
export const useBasketStore = create<IBasketStore>((set, get) => ({
  basket: {},
  addItem(item) {
    set(state => ({
      basket: {
        ...state.basket,
        [item.id]: {
          count: 1,
          item
        }
      }
    }))
  },
  plusItem(id) {
    set(state => ({
      basket: {
        ...state.basket,
        [id]: {
          item: state.basket[id].item,
          count: state.basket[id].count + 1,
        }
      }
    }))
  },
  minusItem(id) {
    const basket = get().basket
    const currentItem = basket[id]
    if (currentItem.count <= 1) {
      const {[id]: removed, ...other} = basket
      set({ basket: other })
      return
    }
    set({
      basket: {
        ...basket,
        [id]: {
          ...currentItem,
          count: currentItem.count - 1
        }
      }
    })
  },
  clear() {
    set({basket: {}})
  },
  computed: {
    get totalPrice() {
      const basket = get().basket
      return Object
        .values(basket)
        .reduce((acc, value) => acc + value.count * value.item.currentPrice, 0)
    }
  }
}))