import { __ } from "@wordpress/i18n";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { isParticipantMinor } from "../helpers";
import { AddressField } from "../form/field/Address";
import { UploadField } from "../form/field/Upload";

const TEXT_DOMAIN = "wolf-membership";

export function ParticipantsStep({
  participants,
  lessons,
  selectedParticipantIndex,
  onChangeParticipant,
  onAddParticipant,
  onRemoveParticipant,
  onSelectParticipant,
  onNext,
  canContinueToContact,
}) {
  const selectedParticipant =
    participants[selectedParticipantIndex] || participants[0];

  const openMediaUploader = (label, onSelect) => {
    if (typeof window === "undefined" || !window.wp || !window.wp.media) {
      return;
    }

    const mediaFrame = window.wp.media({
      title: label,
      button: {
        text: __("Choisir", TEXT_DOMAIN),
      },
      multiple: false,
    });

    mediaFrame.on("select", () => {
      const attachment = mediaFrame.state().get("selection").first().toJSON();

      onSelect({
        id: attachment.id,
        name:
          attachment.filename ||
          attachment.name ||
          attachment.title ||
          "Document",
        url: attachment.url || "",
        type: attachment.mime || attachment.type || "",
        size: attachment.filesizeInBytes || attachment.filesize || 0,
      });
    });

    mediaFrame.open();
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {__("Inscrivez une ou plusieurs personnes", TEXT_DOMAIN)}
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
        {participants.map((participant, index) => (
          <Button
            key={index}
            variant={
              selectedParticipantIndex === index ? "contained" : "outlined"
            }
            color={selectedParticipantIndex === index ? "primary" : "inherit"}
            onClick={() => onSelectParticipant(index)}
            sx={{ textTransform: "none" }}
          >
            {__("Personne", TEXT_DOMAIN)} {index + 1}
            {participant.firstname || participant.lastname
              ? ` · ${participant.firstname} ${participant.lastname}`.trim()
              : ""}
          </Button>
        ))}
      </Box>

      {selectedParticipant && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
              mb={2}
            >
              <Typography variant="h6">
                {__("Personne", TEXT_DOMAIN)} {selectedParticipantIndex + 1}
              </Typography>
              {participants.length > 1 && (
                <IconButton
                  color="error"
                  aria-label={__("Supprimer la personne", TEXT_DOMAIN)}
                  onClick={() => onRemoveParticipant(selectedParticipantIndex)}
                >
                  <RemoveIcon />
                </IconButton>
              )}
            </Box>

            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
              gap={2}
            >
              <TextField
                label={__("Prénom", TEXT_DOMAIN)}
                value={selectedParticipant.firstname}
                onChange={(event) =>
                  onChangeParticipant(
                    selectedParticipantIndex,
                    "firstname",
                    event.target.value,
                  )
                }
                fullWidth
                required
              />
              <TextField
                label={__("Nom", TEXT_DOMAIN)}
                value={selectedParticipant.lastname}
                onChange={(event) =>
                  onChangeParticipant(
                    selectedParticipantIndex,
                    "lastname",
                    event.target.value,
                  )
                }
                fullWidth
                required
              />
              <TextField
                label={__("Date de naissance", TEXT_DOMAIN)}
                type="date"
                value={selectedParticipant.birthdate}
                onChange={(event) =>
                  onChangeParticipant(
                    selectedParticipantIndex,
                    "birthdate",
                    event.target.value,
                  )
                }
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                label={__("Type de licence", TEXT_DOMAIN)}
                value={selectedParticipant.license_type || "hobby"}
                onChange={(event) =>
                  onChangeParticipant(
                    selectedParticipantIndex,
                    "license_type",
                    event.target.value,
                  )
                }
                fullWidth
                required
              >
                <MenuItem value="hobby">
                  {__("Licence loisir", TEXT_DOMAIN)}
                </MenuItem>
                <MenuItem value="competition">
                  {__("Licence compétition", TEXT_DOMAIN)}
                </MenuItem>
              </TextField>
              <TextField
                select
                label={__("Cours souhaité", TEXT_DOMAIN)}
                value={selectedParticipant.lesson_id}
                onChange={(event) =>
                  onChangeParticipant(
                    selectedParticipantIndex,
                    "lesson_id",
                    event.target.value,
                  )
                }
                fullWidth
                required
                sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}
              >
                <MenuItem value="">
                  {__("Choisir un cours", TEXT_DOMAIN)}
                </MenuItem>
                {lessons.map((lesson) => (
                  <MenuItem key={lesson.id} value={String(lesson.id)}>
                    {lesson.title || lesson.name || `Cours #${lesson.id}`}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                {__("Adresse", TEXT_DOMAIN)}
              </Typography>

              <AddressField
                address={selectedParticipant.address || {}}
                onChange={(address) => {
                  onChangeParticipant(selectedParticipantIndex, "address", {
                    ...(selectedParticipant.address || {}),
                    ...address,
                  });
                }}
              />
            </Box>

            {isParticipantMinor(selectedParticipant.birthdate) && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {__("Informations des tuteurs", TEXT_DOMAIN)}
                </Typography>

                {[
                  { key: "tutor1", label: __("Tuteur 1", TEXT_DOMAIN) },
                  { key: "tutor2", label: __("Tuteur 2", TEXT_DOMAIN) },
                ].map(({ key, label }) => (
                  <Box
                    key={key}
                    sx={{
                      mb: 3,
                      p: 2,
                      border: "1px solid rgba(0,0,0,0.12)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      {label}
                    </Typography>
                    <Box
                      display="grid"
                      gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
                      gap={2}
                    >
                      <TextField
                        label={__("Prénom", TEXT_DOMAIN)}
                        value={selectedParticipant[key]?.firstname || ""}
                        onChange={(event) =>
                          onChangeParticipant(selectedParticipantIndex, key, {
                            ...(selectedParticipant[key] || {}),
                            firstname: event.target.value,
                          })
                        }
                        fullWidth
                        required
                      />
                      <TextField
                        label={__("Nom", TEXT_DOMAIN)}
                        value={selectedParticipant[key]?.lastname || ""}
                        onChange={(event) =>
                          onChangeParticipant(selectedParticipantIndex, key, {
                            ...(selectedParticipant[key] || {}),
                            lastname: event.target.value,
                          })
                        }
                        fullWidth
                        required
                      />
                      <TextField
                        label={__("Email", TEXT_DOMAIN)}
                        type="email"
                        value={selectedParticipant[key]?.email || ""}
                        onChange={(event) =>
                          onChangeParticipant(selectedParticipantIndex, key, {
                            ...(selectedParticipant[key] || {}),
                            email: event.target.value,
                          })
                        }
                        fullWidth
                        required
                      />
                      <TextField
                        label={__("Téléphone", TEXT_DOMAIN)}
                        value={selectedParticipant[key]?.phone || ""}
                        onChange={(event) =>
                          onChangeParticipant(selectedParticipantIndex, key, {
                            ...(selectedParticipant[key] || {}),
                            phone: event.target.value,
                          })
                        }
                        fullWidth
                        required
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {selectedParticipant.license_type === "hobby" && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {__("Questionnaire de santé", TEXT_DOMAIN)}
                </Typography>
                <UploadField
                  file={selectedParticipant.health_questionnaire}
                  onChange={(file) =>
                    onChangeParticipant(
                      selectedParticipantIndex,
                      "health_questionnaire",
                      file,
                    )
                  }
                />
              </Box>
            )}

            {selectedParticipant.license_type === "competition" && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {__(
                    "Documents requis pour la licence compétition",
                    TEXT_DOMAIN,
                  )}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mb: 0.5 }}
                  >
                    {__("Photo d'identité", TEXT_DOMAIN)}
                  </Typography>
                  <UploadField
                    file={selectedParticipant.identity_photo}
                    onChange={(file) =>
                      onChangeParticipant(
                        selectedParticipantIndex,
                        "identity_photo",
                        file,
                      )
                    }
                  />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mb: 0.5 }}
                  >
                    {__("Certificat médical", TEXT_DOMAIN)}
                  </Typography>
                  <UploadField
                    file={selectedParticipant.medical_certificate}
                    onChange={(file) =>
                      onChangeParticipant(
                        selectedParticipantIndex,
                        "medical_certificate",
                        file,
                      )
                    }
                  />
                </Box>
              </Box>
            )}

            <TextField
              label={__("Informations complémentaires", TEXT_DOMAIN)}
              value={selectedParticipant.comment}
              onChange={(event) =>
                onChangeParticipant(
                  selectedParticipantIndex,
                  "comment",
                  event.target.value,
                )
              }
              multiline
              minRows={2}
              fullWidth
              sx={{ mt: 2 }}
            />
          </CardContent>
        </Card>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAddParticipant}
        >
          {__("Ajouter une personne", TEXT_DOMAIN)}
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!canContinueToContact}
        >
          {__("Suivant", TEXT_DOMAIN)}
        </Button>
      </Box>
    </Box>
  );
}
