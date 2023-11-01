import { 
    createContext, 
    useMemo, 
    useReducer,
    ReactElement,
} from 'react'

export type CartItemType = {
    sku: string,
    name: string,
    price: number,
    qty: number,
}

type CartStateType = {
    cart: CartItemType[]
}

const initialCartState: CartStateType = {
    cart: []
}

//creating a REDUCER_ACTION_TYPE
const REDUCER_ACTION_TYPE = {
    ADD: 'ADD',
    REMOVE: 'REMOVE',
    QUANTITY: 'QUANTITY',
    SUBMIT: 'SUBMIT',
}

export type ReducerActionType = typeof REDUCER_ACTION_TYPE

//creating a Reducer-Action
export type ReducerAction = {
    type: string,
    payload?: CartItemType
}

const reducer = (state: CartStateType, action: ReducerAction): CartStateType => {
    switch(action.type){
        case REDUCER_ACTION_TYPE.ADD: {
            if(!action.payload){
                throw new Error('action.payload missing in ADD action')
            }
            const { sku, name, price } = action.payload

            const filteredCart:CartItemType[] = state.cart.filter(item =>  item.sku !== sku) 

            const itemExists: CartItemType | undefined = state.cart.find(item => item.sku === sku)

            const qty: number = itemExists ? itemExists.qty + 1 : 1

            return {...state, cart: [...filteredCart, {sku, name, price, qty}]}
        }

        case REDUCER_ACTION_TYPE.REMOVE: {
            if(!action.payload){
                throw new Error('action.payload missing in REMOVE action')
            }
            const { sku } = action.payload

            const filteredCart:CartItemType[] = state.cart.filter(item =>  item.sku !== sku) 

            return {...state, cart: [...filteredCart]}
            
        }

        case REDUCER_ACTION_TYPE.QUANTITY: {
            if(!action.payload){
                throw new Error('action.payload missing in QUANTITY action')
            }
            const { sku, qty } = action.payload

            const itemExists: CartItemType | undefined = state.cart.find(item => item.sku === sku)

            if(!itemExists) {
                throw new Error('Item must exist in order to update quantity')
            }

            const updateItem:CartItemType = {
                ...itemExists, qty
            }

            const filteredCart:CartItemType[] = state.cart.filter(item =>  item.sku !== sku) 

            return {...state, cart: [...filteredCart, updateItem]}



        }

        case REDUCER_ACTION_TYPE.SUBMIT: {
            return {...state, cart: []}
        }
        default:
            throw new Error('Unidentified Reducer Action')
    }
}


//creating useCartContext CUSTOM Hook
const useCartContext = (initialCartState: CartStateType) => {
    const [state, dispatch] = useReducer(reducer, initialCartState)

    const REDUCER_ACTIONS = useMemo(() => {
        return REDUCER_ACTION_TYPE
    },[])

    const totalItems: number = state.cart.reduce((prevValue, cartItem) => {
        return prevValue + cartItem.qty
    }, 0)

    const totalPrice = new Intl.NumberFormat('en-Us', {
        style: 'currency', currency: 'USD'
    }).format(state.cart.reduce((prev, cartItem) => {
        return prev + (cartItem.price * cartItem.qty)
    }, 0))

    const cart = state.cart.sort((a, b) => {
        const itemA = Number(a.sku.slice(-4))
        const itemB = Number(b.sku.slice(-4))
        return itemA - itemB
    })

    return { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart  }
    
}

export type UseCartContextType = ReturnType<typeof useCartContext>

////////////////
const initialCartContextState: UseCartContextType = {
    dispatch: () => {}, //initializer function
    REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
    totalItems: 0,
    totalPrice: '',
    cart: [],
}

export const CartContext = createContext<UseCartContextType>(initialCartContextState) 

type ChildrenType = {
    children?: ReactElement | ReactElement[]
}

//creating the cart Provider
export const CartProvider = ({ children }: ChildrenType):ReactElement => {
    return <CartContext.Provider value={useCartContext(initialCartState)}>
        { children }
    </CartContext.Provider>
}

export default CartContext