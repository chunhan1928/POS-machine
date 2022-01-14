import styled from "styled-components";
import { Paper } from "@mui/material";

const FoodItem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 23%;
    height: 25%;
    margin: 5px;
    box-shadow: 0.3vmin 0.3vmin 1vmin #EEEEEE; // white
    background-color: #F3A738; // Yellow Orange
    &:hover {
        color: white;
        cursor: pointer;
    }
`

export default FoodItem;