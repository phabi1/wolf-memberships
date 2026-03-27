import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ContactsForm from "./ContactsForm";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export type MemerFormData = {
  firstname: string;
  lastname: string;
  birthdate: string;
  license_number?: string;
  wheels: number[];
  contacts: { firstname: string; lastname: string; phone: string }[];
};

export type MemberFormProps = {
  data: MemerFormData;
  onDataChange: (data: MemerFormData) => void;
};

export default function MemberForm({ data, onDataChange }: MemberFormProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const [wheels, setWheels] = useState<
    { id: number; title: string; checked: boolean }[]
  >([
    { id: 1, title: "Yellow", checked: false },
    { id: 2, title: "Green", checked: false },
    { id: 3, title: "Blue", checked: false },
    { id: 4, title: "Red", checked: false },
    { id: 5, title: "Black", checked: false },
  ]);

  const handleWheelChange = (id: number) => {
    setWheels((prevWheels) =>
      prevWheels.map((wheel) =>
        wheel.id === id ? { ...wheel, checked: !wheel.checked } : wheel,
      ),
    );
    onDataChange({
      ...data,
      wheels: wheels.filter((wheel) => wheel.checked).map((wheel) => wheel.id),
    });
  };

  return (
    <form>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label="Default Informations" {...a11yProps(0)} />
        <Tab label="Contacts" {...a11yProps(1)} />
        <Tab label="Wheels" {...a11yProps(2)} />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <div>
          <TextField
            type="text"
            id="firstname"
            label="First Name"
            name="firstname"
            variant="outlined"
            value={data.firstname}
            onChange={(e) =>
              onDataChange({ ...data, firstname: e.target.value })
            }
          />
        </div>
        <div>
          <TextField
            type="text"
            id="lastname"
            label="Last Name"
            name="lastname"
            variant="outlined"
            value={data.lastname}
            onChange={(e) =>
              onDataChange({ ...data, lastname: e.target.value })
            }
          />
        </div>
        <div>
          <TextField
            type="date"
            id="birthdate"
            label="Birthdate"
            name="birthdate"
            variant="outlined"
            value={data.birthdate}
            onChange={(e) =>
              onDataChange({ ...data, birthdate: e.target.value })
            }
          />
        </div>
        <div>
          <TextField
            type="text"
            id="license_number"
            label="License Number"
            name="license_number"
            variant="outlined"
            value={data.license_number}
            onChange={(e) =>
              onDataChange({ ...data, license_number: e.target.value })
            }
          />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ContactsForm
          contacts={data.contacts}
          onContactsChange={(contacts) => onDataChange({ ...data, contacts })}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel component="legend">Wheels</FormLabel>
          <FormGroup>
            {wheels.map((wheel) => (
              <FormControlLabel
                key={wheel.id}
                control={
                  <Checkbox
                    checked={wheel.checked}
                    onChange={() => handleWheelChange(wheel.id)}
                    name={wheel.title}
                  />
                }
                label={wheel.title}
              />
            ))}
          </FormGroup>
        </FormControl>
      </CustomTabPanel>
    </form>
  );
}
