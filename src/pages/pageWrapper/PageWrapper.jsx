import { HeaderBar } from "../../components/headerBar/HeaderBar";
import "./PageWrapper.scss"

export default function PageWrapper(props) {
  return <div id="page-container">
    <HeaderBar />
    {props.children}
  </div>
}