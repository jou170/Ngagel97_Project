import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import PrintIcon from "@mui/icons-material/Print";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";

const products = [
  {
    link: "/master/addon",
    text: "Addon",
    icon: <InboxIcon />,
    subMenu: [
      { link: "/master/addon/add", text: "Add Addon", icon: <AddIcon /> },
    ],
  },
  {
    link: "/master/service",
    text: "Service",
    icon: <PrintIcon />,
    subMenu: [
      { link: "/master/service/add", text: "Add Service", icon: <AddIcon /> },
    ],
  },
  {
    link: "/master/item",
    text: "Item",
    icon: <DraftsIcon />,
    subMenu: [
      { link: "/master/item/add", text: "Add Item", icon: <AddIcon /> },
    ],
  },
];

const menu = [
  { link: "/master", text: "Dashboard", icon: <PersonIcon /> },
  { link: "/master/user", text: "User", icon: <PersonIcon /> },
  {
    text: "Reports",
    icon: <BarChartIcon />,
    children: [
      { link: "/master/report/sales", text: "Sales", icon: <InboxIcon /> },
      { link: "/master/report/delivery", text: "Delivery", icon: <SendIcon /> },
      { link: "/master/report/daily", text: "Daily", icon: <DraftsIcon /> },
    ],
  },
];

export default function MasterDrawer() {
  const [open, setOpen] = React.useState({});

  const handleClick = (text) => {
    setOpen((prevState) => ({
      ...prevState,
      [text]: !prevState[text],
    }));
  };

  const renderListItems = (items) => {
    return items.map((item) => (
      <ListItemButton key={item.text} component="a" href={item.link}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItemButton>
    ));
  };

  const renderNestedListItems = (item) => {
    return (
      <>
        <ListItemButton onClick={() => handleClick(item.text)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
          {open[item.text] ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open[item.text]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <ListItemButton
                key={child.text}
                sx={{ pl: 4 }} // Memberikan indentasi ke kiri
                component="a"
                href={child.link}
              >
                <ListItemIcon>{child.icon}</ListItemIcon>
                <ListItemText primary={child.text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </>
    );
  };

  return (
    <Box sx={{ overflow: "auto" }}>
      <List
        key={0}
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Menu
          </ListSubheader>
        }
      >
        {menu.map((item) =>
          item.children ? renderNestedListItems(item) : renderListItems([item])
        )}
      </List>
      <Divider />
      <List
        key={1}
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Products
          </ListSubheader>
        }
      >
        {products.map((product) => (
          <>
            {/* Produk Utama */}
            <ListItemButton
              key={product.text}
              component="a"
              href={product.link}
            >
              <ListItemIcon>{product.icon}</ListItemIcon>
              <ListItemText primary={product.text} />
            </ListItemButton>
            {/* Menu Tambahan (Addons, Add Service, Add Item) */}
            {product.subMenu &&
              product.subMenu.map((sub) => (
                <ListItemButton
                  key={sub.text}
                  sx={{ pl: 4 }} // Memberikan indentasi
                  component="a"
                  href={sub.link}
                >
                  <ListItemIcon>{sub.icon}</ListItemIcon>
                  <ListItemText primary={sub.text} />
                </ListItemButton>
              ))}
          </>
        ))}
      </List>
    </Box>
  );
}
