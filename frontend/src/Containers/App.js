import { useEffect, useState } from 'react'
import { message } from 'antd'
import styled from 'styled-components'
import axios from '../api';
import Manager from './Manager'
import Cashier from './Cashier'
import SignIn from './signIn'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  margin: auto;
	backgroundImage: 'url(../Image/background.jpeg)'
`
const LOCALSTORAGE_KEY = "save-me";
function App() {
	const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);
	const [me, setMe] = useState(savedMe || '');
	const [pwd, setPwd] = useState('');
	const [signedIn, setSignedIn] = useState(false);
	const [isManager, setIsManager] = useState(false);
	const [data, setData] = useState([]);

	const logIn = async () => {
		/*
		const { logged, priviledge, data } = await axios.get('/login', {
			params: {
				user: me,
				password: pwd,
			},
		});
		*/
		console.log("axios.get('/login', ...)");
		// 以下是暫時的資料
		var logged = true;
		var priviledge = true;
		var testData = [
			{
				key: 1,
				id: 1,
				name: 'Product1',
				catagory: "類別一",
				amount: 10,
				price: 20,
				cost: 10,
			},
			{
				key: 2,
				id: 2,
				name: 'Product2',
				catagory: "類別二",
				amount: 30,
				price: 40,
				cost: 10,
			},
		];
		setData(testData);
		// 以上是暫時的資料

		if (logged === true) {
			setSignedIn(true);
			if (priviledge === true) setIsManager(true);
			else setIsManager(false);

			displayStatus({
				type: "success",
				msg: me + "，您好！",
			})
		}
		else {
			displayStatus({
				type: "error",
				msg: "登入失敗",
			})
		}
	}
	const displayStatus = (payload) => {
		if (payload.msg) {
			const { type, msg } = payload;
			const content = { content: msg, duration: 2 };
			switch (type) {
				case 'success':
					message.success(content);  // message.success() from 'antd'
					break;
				case 'error':
				default:
					message.error(content);    // message.error() from 'antd'
					break;
			}
		}
	}
	useEffect(() => {
		if (signedIn) {
			localStorage.setItem(LOCALSTORAGE_KEY, me);
		}
	}, [signedIn, me]);

	return (
		<Wrapper>
			{
				!signedIn ? (
					<SignIn
						me={me}
						setMe={setMe}
						pwd={pwd}
						setPwd={setPwd}
						logIn={logIn}
						displayStatus={displayStatus}
					/>
				) : isManager ? (
					<Manager
						me={me}
						data={data}
						displayStatus={displayStatus}
					/>
				) : (
					<Cashier/>
				)
			}
		</Wrapper>
	)
}

export default App
