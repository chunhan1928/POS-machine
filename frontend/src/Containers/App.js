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
		const { data: {stockdata, logged, priviledge} } = await axios.get('/login', {
			params: {
				user: me,
				password: pwd,
			},
		});
		setData(stockdata);
		
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

	const logout = () => {
		setMe('')
		setIsManager(false)
		setSignedIn(false)
		setData([])
		setPwd("")
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
					<Cashier
						me={me}
						data={data}
					/>
				)
			}
		</Wrapper>
	)
}

export default App
