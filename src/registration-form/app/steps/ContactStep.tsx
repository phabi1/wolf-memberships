import { __ } from "@wordpress/i18n";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const TEXT_DOMAIN = "wolf-membership";

export function ContactStep({ contact, onChangeContact, onBack, onNext, canNext }: {
  contact: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    notes?: string;
  };
  onChangeContact: (field: string, value: any) => void;
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
}) {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {__("Contact Information", TEXT_DOMAIN)}
      </Typography>

      <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
        <TextField
          label={__("First Name", TEXT_DOMAIN)}
          value={contact.firstname}
          onChange={(event) => onChangeContact("firstname", event.target.value)}
          fullWidth
          required
        />
        <TextField
          label={__("Last Name", TEXT_DOMAIN)}
          value={contact.lastname}
          onChange={(event) => onChangeContact("lastname", event.target.value)}
          fullWidth
          required
        />
        <TextField
          label={__("Email", TEXT_DOMAIN)}
          type="email"
          value={contact.email}
          onChange={(event) => onChangeContact("email", event.target.value)}
          fullWidth
          required
        />
        <TextField
          label={__("Phone", TEXT_DOMAIN)}
          value={contact.phone}
          onChange={(event) => onChangeContact("phone", event.target.value)}
          fullWidth
          required
        />
      </Box>

      <TextField
        label={__("Message or special request", TEXT_DOMAIN)}
        value={contact.notes}
        onChange={(event) => onChangeContact("notes", event.target.value)}
        multiline
        minRows={3}
        fullWidth
        sx={{ mt: 2 }}
      />

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button onClick={onBack}>{__("Back", TEXT_DOMAIN)}</Button>
        <Button variant="contained" onClick={onNext} disabled={!canNext}>
          {__("View Summary", TEXT_DOMAIN)}
        </Button>
      </Box>
    </Box>
  );
}
