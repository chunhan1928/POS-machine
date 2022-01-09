import { Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Title from "../Components/Title";

const SignIn = ({ me, setMe, pwd, setPwd, logIn, displayStatus }) => (
	<>
		<Title style={{ width: 600, margin: 10 }}>
			<h1>Welcome to our POS Machine</h1>
		</Title>
		<Title style={{ width: 600, margin: 0 }}>
			<h2>Please Log in.</h2>
		</Title>
		<Input
			prefix={<UserOutlined style={{ margin: 5 }} />}
			value={me}
			onChange={(e) => setMe(e.target.value)}
			placeholder="請輸入使用者名稱"
			size="large" style={{ width: 300, margin: 10 }}
		/>
		<Input.Password
			prefix={<LockOutlined style={{ margin: 5 }} />}
			value={pwd}
			onChange={(e) => setPwd(e.target.value)}
			placeholder="請輸入密碼"
			size="large" style={{ width: 300, margin: 10 }}
		/>
		<span>
			<Button
				type="primary"
				size="large" style={{ width: 100, margin: 10 }}
				onClick={() => {
					if (me === '')
						displayStatus({
							type: "error",
							msg: "請輸入使用者名稱",
						});
					else {
						if (pwd === '')
							displayStatus({
								type: "error",
								msg: "請輸入密碼",
							});
						else logIn()
					}
				}}

			> 登入 </Button>
			<Button
				type="primary"
				size="large" style={{ width: 100, margin: 10 }}
			> 註冊 </Button>
		</span>
	</>
);
export default SignIn;
