import { Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Title from "../Components/Title";

const SignIn = ({ me, setMe, pwd, setPwd, logIn, displayStatus }) => (
	<>
		<Title style={{ width: 600, margin: 30 }}>
			<h1>Welcome to our POS Machine</h1>
		</Title>
		<Input
			prefix={<UserOutlined />}
			value={me}
			onChange={(e) => setMe(e.target.value)}
			placeholder="請輸入使用者名稱"
			size="large" style={{ width: 300, margin: 0 }}
		/>
		<Input.Password
			prefix={<LockOutlined />}
			value={pwd}
			onChange={(e) => setPwd(e.target.value)}
			placeholder="請輸入密碼"
			size="large" style={{ width: 300, margin: 0 }}
		/>
		<Button
			type="primary"
			size="large" style={{ width: 100, margin: 20 }}
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
	</>
);
export default SignIn;
