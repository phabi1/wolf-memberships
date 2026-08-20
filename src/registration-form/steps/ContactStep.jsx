import { __ } from "@wordpress/i18n";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const TEXT_DOMAIN = "wolf-membership";

export function ContactStep({ contact, onChangeContact, onBack, onReview, canSubmit }) {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {__("Informations de contact", TEXT_DOMAIN)}
      </Typography>

      <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
        <TextField
          label={__("Prénom du contact", TEXT_DOMAIN)}
          value={contact.firstname}
          onChange={(event) => onChangeContact("firstname", event.target.value)}
          fullWidth
          required
        />
        <TextField
          label={__("Nom du contact", TEXT_DOMAIN)}
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
          label={__("Téléphone", TEXT_DOMAIN)}
          value={contact.phone}
          onChange={(event) => onChangeContact("phone", event.target.value)}
          fullWidth
          required
        />
      </Box>

      <TextField
        label={__("Message ou besoin particulier", TEXT_DOMAIN)}
        value={contact.notes}
        onChange={(event) => onChangeContact("notes", event.target.value)}
        multiline
        minRows={3}
        fullWidth
        sx={{ mt: 2 }}
      />

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button onClick={onBack}>{__("Retour", TEXT_DOMAIN)}</Button>
        <Button variant="contained" onClick={onReview} disabled={!canSubmit}>
          {__("Voir le résumé", TEXT_DOMAIN)}
        </Button>
      </Box>
    </Box>
  );
}
