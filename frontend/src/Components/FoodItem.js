import styled from "styled-components";

const FoodItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 23%;
    height: 25%;
    margin: 5px;
    // background-color: pink
    &:hover {
        color: white;
        cursor: pointer;
    }
`

export default FoodItem;