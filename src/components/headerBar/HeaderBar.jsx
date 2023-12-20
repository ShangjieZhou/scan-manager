import navbit from "../../assets/navbit.svg";
import "./HeaderBar.scss";
import { TbMenu2 } from 'react-icons/tb';

export function HeaderBar(props) {

  return <div key="header-bar" id="header-bar">
    <section id="logo-section">
      <img id="banner-logo" src={navbit} alt="" />
    </section>
    <section id="name-section">
      {props.name}
    </section>
    <section id="menu-section">
      <TbMenu2 color="#00adbb" id="banner-menu" size="1.8rem"/>
    </section>
  </div>
}