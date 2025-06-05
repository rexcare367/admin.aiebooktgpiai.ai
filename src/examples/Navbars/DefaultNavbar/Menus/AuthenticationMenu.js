import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import { useAuth } from "hooks/useAuth";

function AuthenticationMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/authentication/sign-in/basic');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      key: 'sign-in-basic',
      label: 'Sign In',
      path: '/authentication/sign-in/basic',
      icon: 'login'
    }
  ];

  return (
    <>
      <SoftBox
        display="flex"
        alignItems="center"
        px={1}
        onClick={handleClick}
        sx={{ cursor: "pointer" }}
      >
        <Icon fontSize="small" sx={{ color: "text.primary" }}>account_circle</Icon>
      </SoftBox>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'auth-button',
        }}
      >
        {menuItems.map((item) => (
          <MenuItem 
            key={item.key}
            onClick={() => {
              navigate(item.path);
              handleClose();
            }}
          >
            <Icon>{item.icon}</Icon>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default AuthenticationMenu;