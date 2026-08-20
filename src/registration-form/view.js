import { createRoot } from "react-dom/client";
import { useEffect, useMemo, useState } from "react";
import { __ } from "@wordpress/i18n";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { ParticipantsStep } from "./steps/ParticipantsStep";
import { ContactStep } from "./steps/ContactStep";
import { ReviewStep } from "./steps/ReviewStep";
import { isParticipantMinor } from "./helpers";

const TEXT_DOMAIN = "wolf-membership";

const emptyParticipant = () => ({
  firstname: "",
  lastname: "",
  birthdate: "",
  lesson_id: "",
  license_type: "hobby",
  address: {
    line1: "",
    line2: "",
    zipcode: "",
    city: "",
    country: "",
  },
  tutor1: {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  },
  tutor2: {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  },
  health_questionnaire: null,
  identity_photo: null,
  medical_certificate: null,
  comment: "",
});

function App({ campaignId }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);
  const [registration, setRegistration] = useState({ lessons: [] });
  const [participants, setParticipants] = useState([emptyParticipant()]);
  const [selectedParticipantIndex, setSelectedParticipantIndex] = useState(0);
  const [totalToPay, setTotalToPay] = useState(0);
  const [pricingBreakdown, setPricingBreakdown] = useState([]);
  const [contact, setContact] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    fetch(`/wp-json/wolf-memberships/v1/campaigns/${campaignId}/registration`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Impossible de charger l'inscription.");
        }
        return response.json();
      })
      .then((data) => {
        setRegistration(data || { lessons: [] });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || __("Une erreur est survenue.", TEXT_DOMAIN));
        setLoading(false);
      });
  }, [campaignId]);

  const lessons = useMemo(() => registration.lessons || [], [registration]);

  const fetchTotalFromBackend = async () => {
    try {
      const response = await fetch(
        `/wp-json/wolf-memberships/v1/campaigns/${campaignId}/registration/calculate-total`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participants: participants.map((participant) => ({
              firstname: participant.firstname,
              lastname: participant.lastname,
              birthdate: participant.birthdate,
              address: {
                line1: participant.address?.line1 || "",
                line2: participant.address?.line2 || "",
                zipcode: participant.address?.zipcode || "",
                city: participant.address?.city || "",
                country: participant.address?.country || "",
              },
              tutor1: participant.tutor1 || {
                firstname: "",
                lastname: "",
                email: "",
                phone: "",
              },
              tutor2: participant.tutor2 || {
                firstname: "",
                lastname: "",
                email: "",
                phone: "",
              },
              lesson_id: participant.lesson_id
                ? Number(participant.lesson_id)
                : "",
              license_type: participant.license_type || "hobby",
              comment: participant.comment || "",
              health_questionnaire: participant.health_questionnaire
                ? participant.health_questionnaire
                : null,
              identity_photo: participant.identity_photo
                ? participant.identity_photo
                : null,
              medical_certificate: participant.medical_certificate
                ? participant.medical_certificate
                : null,
            })),
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.message ||
            __("Le montant n'a pas pu être calculé.", TEXT_DOMAIN),
        );
      }

      const data = await response.json().catch(() => ({}));
      setTotalToPay(Number(data.total_amount ?? 0));
      setPricingBreakdown(
        Array.isArray(data.pricing_breakdown) ? data.pricing_breakdown : [],
      );
      return Number(data.total_amount ?? 0);
    } catch (err) {
      setError(
        err.message ||
          __("Une erreur est survenue lors du calcul du montant.", TEXT_DOMAIN),
      );
      return 0;
    }
  };

  useEffect(() => {
    if (step !== 2) {
      return;
    }

    fetchTotalFromBackend();
  }, [step, participants, campaignId]);

  const updateParticipant = (index, field, value) => {
    setParticipants((current) =>
      current.map((participant, participantIndex) => {
        if (participantIndex !== index) {
          return participant;
        }

        if (field === "tutor1" || field === "tutor2") {
          return {
            ...participant,
            [field]: {
              ...(participant[field] || {}),
              ...value,
            },
          };
        }

        return { ...participant, [field]: value };
      }),
    );
  };

  const addParticipant = () => {
    setParticipants((current) => {
      const nextParticipants = [...current, emptyParticipant()];
      setSelectedParticipantIndex(nextParticipants.length - 1);
      return nextParticipants;
    });
  };

  const removeParticipant = (index) => {
    const nextParticipants =
      participants.length === 1
        ? [emptyParticipant()]
        : participants.filter(
            (_, participantIndex) => participantIndex !== index,
          );
    setParticipants(nextParticipants);
    setSelectedParticipantIndex(Math.max(0, nextParticipants.length - 1));
  };

  const canContinueToContact = participants.every((participant) => {
    const basicInfo =
      participant.firstname &&
      participant.lastname &&
      participant.birthdate &&
      participant.lesson_id;

    const minorInfo =
      !isParticipantMinor(participant.birthdate) ||
      (participant.tutor1 &&
        participant.tutor1.firstname &&
        participant.tutor1.lastname &&
        participant.tutor1.email &&
        participant.tutor1.phone &&
        participant.tutor2 &&
        participant.tutor2.firstname &&
        participant.tutor2.lastname &&
        participant.tutor2.email &&
        participant.tutor2.phone);

    if (participant.license_type === "hobby") {
      return basicInfo && minorInfo && !!participant.health_questionnaire;
    }

    if (participant.license_type === "competition") {
      return (
        basicInfo &&
        minorInfo &&
        !!participant.identity_photo &&
        !!participant.medical_certificate
      );
    }

    return basicInfo && minorInfo;
  });

  const canSubmit =
    contact.firstname &&
    contact.lastname &&
    contact.email &&
    contact.phone &&
    participants.every((participant) => {
      const basicInfo =
        participant.firstname &&
        participant.lastname &&
        participant.birthdate &&
        participant.lesson_id;

      const minorInfo =
        !isParticipantMinor(participant.birthdate) ||
        (participant.tutor1 &&
          participant.tutor1.firstname &&
          participant.tutor1.lastname &&
          participant.tutor1.email &&
          participant.tutor1.phone &&
          participant.tutor2 &&
          participant.tutor2.firstname &&
          participant.tutor2.lastname &&
          participant.tutor2.email &&
          participant.tutor2.phone);

      if (participant.license_type === "hobby") {
        return basicInfo && minorInfo && !!participant.health_questionnaire;
      }

      if (participant.license_type === "competition") {
        return (
          basicInfo &&
          minorInfo &&
          !!participant.identity_photo &&
          !!participant.medical_certificate
        );
      }

      return basicInfo && minorInfo;
    });

  const handleNext = () => {
    if (!canContinueToContact) {
      setError(
        __(
          "Merci de remplir tous les champs de chaque inscrit avant de continuer.",
          TEXT_DOMAIN,
        ),
      );
      return;
    }
    setError("");
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError(
        __(
          "Merci de compléter les informations de contact et de chaque inscrit.",
          TEXT_DOMAIN,
        ),
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        payer: {
          firstname: contact.firstname,
          lastname: contact.lastname,
          email: contact.email,
          phone: contact.phone,
          notes: contact.notes,
        },
        participants: participants.map((participant) => ({
          firstname: participant.firstname,
          lastname: participant.lastname,
          birthdate: participant.birthdate,
          address: participant.address || {
            line1: "",
            line2: "",
            zipcode: "",
            city: "",
            country: "",
          },
          tutor1: participant.tutor1 || {
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
          },
          tutor2: participant.tutor2 || {
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
          },
          lesson_id: Number(participant.lesson_id),
          license_type: participant.license_type || "hobby",
          health_questionnaire:
            participant.license_type === "hobby" &&
            participant.health_questionnaire
              ? participant.health_questionnaire
              : null,
          identity_photo:
            participant.license_type === "competition" &&
            participant.identity_photo
              ? participant.identity_photo
              : null,
          medical_certificate:
            participant.license_type === "competition" &&
            participant.medical_certificate
              ? participant.medical_certificate
              : null,
          comment: participant.comment,
        })),
      };

      const response = await fetch(
        `/wp-json/wolf-memberships/v1/campaigns/${campaignId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.message ||
            __("L'inscription n'a pas pu être enregistrée.", TEXT_DOMAIN),
        );
      }

      await response.json().catch(() => ({}));
      setSuccess(true);
      setStep(2);
    } catch (err) {
      setError(
        err.message ||
          __("Une erreur est survenue pendant l'inscription.", TEXT_DOMAIN),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        className="wolf-membership-registration-form"
        sx={{ p: 3, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (success) {
    return (
      <Box className="wolf-membership-registration-form" sx={{ p: 3 }}>
        <Alert severity="success">
          <Typography variant="h6">
            {__("Inscription enregistrée !", TEXT_DOMAIN)}
          </Typography>
          <Typography>
            {__(
              "Merci pour votre inscription. Nous vous recontacterons prochainement.",
              TEXT_DOMAIN,
            )}
          </Typography>
        </Alert>
      </Box>
    );
  }

  const steps = [
    __("Participants", TEXT_DOMAIN),
    __("Contact", TEXT_DOMAIN),
    __("Résumé", TEXT_DOMAIN),
  ];

  return (
    <Box
      className="wolf-membership-registration-form"
      sx={{ maxWidth: 840, mx: "auto", p: 2 }}
    >
      <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {step === 0 && (
        <ParticipantsStep
          participants={participants}
          lessons={lessons}
          selectedParticipantIndex={selectedParticipantIndex}
          onChangeParticipant={updateParticipant}
          onAddParticipant={addParticipant}
          onRemoveParticipant={removeParticipant}
          onSelectParticipant={setSelectedParticipantIndex}
          onNext={handleNext}
          canContinueToContact={canContinueToContact}
        />
      )}

      {step === 1 && (
        <ContactStep
          contact={contact}
          onChangeContact={(field, value) =>
            setContact((current) => ({ ...current, [field]: value }))
          }
          onBack={() => setStep(0)}
          onReview={async () => {
            if (!canSubmit) {
              setError(
                __(
                  "Merci de compléter les informations de contact et de chaque inscrit.",
                  TEXT_DOMAIN,
                ),
              );
              return;
            }

            setError("");
            if (participants.every((participant) => !!participant.lesson_id)) {
              setStep(2);
            }
          }}
          canSubmit={canSubmit}
        />
      )}

      {step === 2 && (
        <ReviewStep
          contact={contact}
          participants={participants}
          lessons={lessons}
          totalToPay={totalToPay}
          pricingBreakdown={pricingBreakdown}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </Box>
  );
}

document
  .querySelectorAll(".wp-block-wolf-membership-registration-form")
  .forEach((element) => {
    const campaignId = element.dataset.campaignId;
    if (campaignId) {
      const root = createRoot(element);
      root.render(<App campaignId={campaignId} />);
    }
  });
