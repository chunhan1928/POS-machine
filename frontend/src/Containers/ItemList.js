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
                    style={ item.amount > 0 ? 
                        {backgroundColor: 'pink'}:{backgroundColor: 'black'}}
                >
                    <p>{item.name}</p>
                    <p>{item.amount}</p>
                </FoodItem>
                :
                <></>
                // <div key={i} ></div>
            })}
        </>
    )
};


export default ItemList;