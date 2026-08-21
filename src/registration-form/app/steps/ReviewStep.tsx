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
}: {
  contact: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    notes?: string;
  };
  participants: any[];
  lessons: any[];
  totalToPay: number;
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const formattedTotal = formatPrice(totalToPay);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {__("Review Your Registration", TEXT_DOMAIN)}
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
                {__("Person", TEXT_DOMAIN)} {index + 1}
              </Typography>
              <Typography>
                {participant.firstname} {participant.lastname}
              </Typography>
              <Typography>{participant.birthdate}</Typography>
              <Typography>
                {__("Course:", TEXT_DOMAIN)} {lesson ? lesson.title || lesson.name : __("Not selected", TEXT_DOMAIN)}
              </Typography>
              <Typography>
                {__("License:", TEXT_DOMAIN)} {participant.licenseType === "competition" ? __("Competition", TEXT_DOMAIN) : __("Hobby", TEXT_DOMAIN)}
              </Typography>
              <Typography>
                {__("Address:", TEXT_DOMAIN)} {[
                  participant.street,
                  participant.line1,
                  participant.line2,
                  participant.zipcode,
                  participant.city,
                  participant.country,
                ].filter(Boolean).join(", ") || __("Not provided", TEXT_DOMAIN)}
              </Typography>
              {isParticipantMinor(participant.birthdate) && (
                <>
                  <Typography>
                    {__("Guardian 1:", TEXT_DOMAIN)} {participant.tutor1?.firstname || __("Not provided", TEXT_DOMAIN)} {participant.tutor1?.lastname || ""} · {participant.tutor1?.email || ""} · {participant.tutor1?.phone || ""}
                  </Typography>
                  <Typography>
                    {__("Guardian 2:", TEXT_DOMAIN)} {participant.tutor2?.firstname || __("Not provided", TEXT_DOMAIN)} {participant.tutor2?.lastname || ""} · {participant.tutor2?.email || ""} · {participant.tutor2?.phone || ""}
                  </Typography>
                </>
              )}
              {participant.licenseType === "hobby" && (
                <Typography>
                  {__("Health Questionnaire:", TEXT_DOMAIN)} {participant.healthQuestionnaire?.name || __("File not added", TEXT_DOMAIN)}
                </Typography>
              )}
              {participant.licenseType === "competition" && (
                <>
                  <Typography>
                    {__("Identity Photo:", TEXT_DOMAIN)} {participant.identityPhoto?.name || __("File not added", TEXT_DOMAIN)}
                  </Typography>
                  <Typography>
                    {__("Medical Certificate:", TEXT_DOMAIN)} {participant.medicalCertificate?.name || __("File not added", TEXT_DOMAIN)}
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
          <Typography variant="h6" gutterBottom>{__("Total to Pay", TEXT_DOMAIN)}</Typography>
          <Typography variant="h5" color="primary">
            {formattedTotal}
          </Typography>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button onClick={onBack} disabled={submitting}>
          {__("Back", TEXT_DOMAIN)}
        </Button>
        <Button variant="contained" color="success" onClick={onSubmit} disabled={submitting}>
          {submitting ? __("Saving...", TEXT_DOMAIN) : __("Confirm", TEXT_DOMAIN)}
        </Button>
      </Box>
    </Box>
  );
}
