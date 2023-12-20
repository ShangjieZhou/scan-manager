import { Login } from "../../components/login/Login.jsx";
import "./LoginPage.scss";

const pageStyle = {
    height: "100vh",
    backgroundImage: "url('https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbCUyMGJhY2tncm91bmR8ZW58MHx8MHx8&w=1000&q=80') ",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    alignItems: "center",
    position: "relative",
};

export function LoginPage(props) {
    return (
        <div id="login-page">
            <Login onSuccess={props.onSuccess} />
        </div>
    )
}