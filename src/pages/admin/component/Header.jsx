
import {
 
  BsPersonCircle,

  BsJustify,
} from "react-icons/bs";
import PropTypes from "prop-types";

function Header({ OpenSidebar }) {
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
       
      </div>
      <div className="header-right">
      
        <BsPersonCircle className="person" />
      </div>
    </header>
  );
}

export default Header;

Header.propTypes = {
  OpenSidebar: PropTypes.func.isRequired,
};
