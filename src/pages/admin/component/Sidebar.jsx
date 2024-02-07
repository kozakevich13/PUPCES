import { HStack, Image, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsGrid1X2Fill,
} from "react-icons/bs";
import { NavLink } from "react-router-dom";
import PUP from "../../../assets/PUPlogo.png";

function Sidebar({ activeLink, OpenSidebar }) {
    const isLinkActive = (link) => link === activeLink;
  return (
    <aside
      id="sidebar"
       //className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <HStack>
            <Image src={PUP} alt="PUP Logo" boxSize="50px" objectFit="cover" />
            <Text color="white">PUPSCES</Text>
          </HStack>
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <NavLink to="/admin" activeclassname="active">
            <HStack>
              <BsGrid1X2Fill className="icon" />
              <Text>Dashboard</Text>
            </HStack>
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink to="/curriupload" activeclassname="active">
            <HStack>
              <BsFillArchiveFill className="icon" />
              <Text>Curriculum</Text>
            </HStack>
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink to="/facultyupload" activeclassname="active">
            <HStack>
              <BsFillGrid3X3GapFill className="icon" />
              <Text>Faculty</Text>
            </HStack>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

Sidebar.propTypes = {
  activeLink: PropTypes.string,
  //openSidebarToggle: PropTypes.bool.isRequired,
  OpenSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
