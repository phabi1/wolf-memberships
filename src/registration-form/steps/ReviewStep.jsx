import { __ } from "@wordpress/i18n";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { formatPrice } from '../pipes';
import { isParticipantMinor } from '../helpers';

const TEXT_DOMAIN = "wolf-membership";

export function ReviewStep({
  contact,
  participants,
  lessons,
  totalToPay,
  onBack,
  onSubmit,
  submitting,
}) {
  const formattedTotal = formatPrice(totalToPay);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {__("Résumé de votre inscription", TEXT_DOMAIN)}
      </Typography>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{__("Contact", TEXT_DOMAIN)}</Typography>
          <Typography>
            {contact.firstname} {contact.lastname}
          </Typography>
          <Typography>{contact.email}</Typography>
          <Typography>{contact.phone}</Typography>
          {contact.notes && <Typography sx={{ mt: 1 }}>{contact.notes}</Typography>}
        </CardContent>
      </Card>

      

      {participants.map((participant, index) => {
        const lesson = lessons.find((item) => String(item.id) === participant.lessonId);

        return (
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {__("Personne", TEXT_DOMAIN)} {index + 1}
              </Typography>
              <Typography>
                {participant.firstname} {participant.lastname}
              </Typography>
              <Typography>{participant.birthdate}</Typography>
              <Typography>
                {__("Cours :", TEXT_DOMAIN)} {lesson ? lesson.title || lesson.name : __("Non sélectionné", TEXT_DOMAIN)}
              </Typography>
              <Typography>
                {__("Licence :", TEXT_DOMAIN)} {participant.licenseType === "competition" ? __("Compétition", TEXT_DOMAIN) : __("Loisir", TEXT_DOMAIN)}
              </Typography>
              <Typography>
                {__("Adresse :", TEXT_DOMAIN)} {[
                  participant.street,
                  participant.line1,
                  participant.line2,
                  participant.zipcode,
                  participant.city,
                  participant.country,
                ].filter(Boolean).join(", ") || __("Non renseignée", TEXT_DOMAIN)}
              </Typography>
              {isParticipantMinor(participant.birthdate) && (
                <>
                  <Typography>
                    {__("Tuteur 1 :", TEXT_DOMAIN)} {participant.tutor1?.firstname || __("Non renseigné", TEXT_DOMAIN)} {participant.tutor1?.lastname || ""} · {participant.tutor1?.email || ""} · {participant.tutor1?.phone || ""}
                  </Typography>
                  <Typography>
                    {__("Tuteur 2 :", TEXT_DOMAIN)} {participant.tutor2?.firstname || __("Non renseigné", TEXT_DOMAIN)} {participant.tutor2?.lastname || ""} · {participant.tutor2?.email || ""} · {participant.tutor2?.phone || ""}
                  </Typography>
                </>
              )}
              {participant.licenseType === "hobby" && (
                <Typography>
                  {__("Questionnaire de santé :", TEXT_DOMAIN)} {participant.healthQuestionnaire?.name || __("Fichier non ajouté", TEXT_DOMAIN)}
                </Typography>
              )}
              {participant.licenseType === "competition" && (
                <>
                  <Typography>
                    {__("Photo d'identité :", TEXT_DOMAIN)} {participant.identityPhoto?.name || __("Fichier non ajouté", TEXT_DOMAIN)}
                  </Typography>
                  <Typography>
                    {__("Certificat médical :", TEXT_DOMAIN)} {participant.medicalCertificate?.name || __("Fichier non ajouté", TEXT_DOMAIN)}
                  </Typography>
                </>
              )}
              {participant.comment && <Typography sx={{ mt: 1 }}>{participant.comment}</Typography>}
            </CardContent>
          </Card>
        );
      })}

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{__("Total à payer", TEXT_DOMAIN)}</Typography>
          <Typography variant="h5" color="primary">
            {formattedTotal}
          </Typography>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button onClick={onBack} disabled={submitting}>
          {__("Retour", TEXT_DOMAIN)}
        </Button>
        <Button variant="contained" color="success" onClick={onSubmit} disabled={submitting}>
          {submitting ? __("Enregistrement...", TEXT_DOMAIN) : __("Confirmer l'inscription", TEXT_DOMAIN)}
        </Button>
      </Box>
    </Box>
  );
}
