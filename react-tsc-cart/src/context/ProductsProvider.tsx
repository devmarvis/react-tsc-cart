import { 
    ReactElement, 
    createContext,
    useState,
} from "react"



//createing a Type that mirrors the Product's object structure
export type ProductType = {
    sku: string,
    name: string,
    price: number
}

// const initialState:ProductType[] = []
const initialState: ProductType[] =  [
    {
        sku: "item0001",
        name: "Widget",
        price: 9.99
    },
    {
        sku: "item0002",
        name: "Premium Widget",
        price: 19.99
    },
    {
        sku: "item0003",
        name: "Deluxe Widget",
        price: 29.99
    }
] 

//creating Products Context Type
export type UseProductsContextType = {
    products: ProductType[]
}

const initialContextState: UseProductsContextType = { products: [] }

//Defining inital context state

const ProductsContext = createContext<UseProductsContextType>(initialContextState)

type ChildrenType = { children: ReactElement | ReactElement[] }


export const ProductsProvider = ({ children }: ChildrenType): ReactElement => {
    const [products] = useState<ProductType[]>(initialState)
    console.log(products)

    return <ProductsContext.Provider value={{ products }} >
        {children}
    </ProductsContext.Provider>
} 

export default ProductsContext