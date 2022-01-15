import FoodItem from "../Components/FoodItem";

const ItemList = ({data, category, handler}) => {
    return(
        <>
            {data.map( (item, i) => {
                return item.category === category?
                <FoodItem
                    key = {item.name}
                    onClick={ item.amount > 0 ? 
                        () => {handler(item.name,item.price,1)} : undefined}
                    style={item.amount > 0 ? 
                        {opacity: '1'}:{opacity: '0.5'}}
                >
                    <span style={{fontSize: '3vmin'}}>{item.name} {item.price}元</span>
                    <span style={{fontSize: '2vmin'}}>剩{item.amount}份</span>
                </FoodItem>
                :
                <></>
                // <div key={i} ></div>
            })}
        </>
    )
};


export default ItemList;