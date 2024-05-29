import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Button, Collapse, List, ListItem } from "@mui/material";
import { useState } from "react";

const SidebarItem: React.FC<{
  icon: React.ReactNode;
  text: string;
  children?: React.ReactNode;
}> = ({ icon, text, children }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem>
        <Button
          disableRipple
          disableTouchRipple
          className="btn-list-sidebar"
          sx={{
            color: "#555",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            borderRadius: 8,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#3f51b5",
              color: "#fff",
            },
          }}
          onClick={handleClick}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {icon}
            <Box component="span" sx={{ ml: 1 }}>
              {text}
            </Box>
          </Box>
          {children &&
            (open ? (
              <ExpandLess
                sx={{
                  color: "#555",
                }}
              />
            ) : (
              <ExpandMore
                sx={{
                  color: "#555",
                }}
              />
            ))}
        </Button>
      </ListItem>
      {children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default SidebarItem;
