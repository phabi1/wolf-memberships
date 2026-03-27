import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export type ContactData = {
  firstname: string;
  lastname: string;
  phone: string;
};

export type ContactsFormProps = {
  contacts: ContactData[];
  onContactsChange: (contacts: ContactData[]) => void;
};

export default function ContactsForm({
  contacts,
  onContactsChange,
}: ContactsFormProps) {
  const [items, setItems] = useState<ContactData[]>([...contacts]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );

  const selectedItem = useMemo(() => {
    if (selectedItemIndex === null) return null;
    return items[selectedItemIndex];
  }, [selectedItemIndex, items]);

  const handleAddContact = () => {
    const newContacts = [...items, { firstname: "", lastname: "", phone: "" }];
    setItems(newContacts);
    setSelectedItemIndex(newContacts.length - 1); // Select the newly added contact
    //onContactsChange(newContacts);
  };

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const handleItemChange = (field: keyof ContactData, event: any) => {
    if (selectedItemIndex === null) return;

    const updatedItem = {
      ...items[selectedItemIndex],
      [field]: event.target.value,
    };

    const newItems = [...items];
    newItems[selectedItemIndex] = updatedItem;
    setItems(newItems);
    onContactsChange(newItems);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <div>
        <Button variant="contained" onClick={handleAddContact}>
          Add Contact
        </Button>
        <List>
          {items.map((item, index) => (
            <ListItem key={index} onClick={() => handleItemClick(index)}>
              <ListItemText
                primary={item.firstname + " " + item.lastname}
                secondary={item.phone}
              />
            </ListItem>
          ))}
        </List>
      </div>
      <div>
        {selectedItem !== null ? (
          <div>
            <div>
              <TextField
                label="First Name"
                value={selectedItem.firstname}
                onChange={(event) => handleItemChange("firstname", event)}
              />
            </div>
            <div>
              <TextField
                label="Last Name"
                value={selectedItem.lastname}
                onChange={(event) => handleItemChange("lastname", event)}
              />
            </div>
            <div>
              <TextField
                label="Phone"
                value={selectedItem.phone}
                onChange={(event) => handleItemChange("phone", event)}
              />
            </div>
          </div>
        ) : (
          <div>Select a contact to see details</div>
        )}
      </div>
    </Box>
  );
}
