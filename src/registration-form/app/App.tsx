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
import { TEXT_DOMAIN } from "./utils";

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

export default function App({ campaignId, requestId, token }: { campaignId: string; requestId?: string; token?: string }) {
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
        const url = `/wp-json/wolf-memberships/v1/campaigns/${campaignId}/registration?request_id=${requestId}&token=${token}`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("An error occurred while loading the registration.");
                }
                return response.json();
            })
            .then((data) => {
                setRegistration({ lessons: data.lessons || [] });
                if (data.request) {
                    setContact({
                        ...data.request.contact,
                    });
                    setParticipants(data.request.participants || [emptyParticipant()]);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || __("An error occurred.", TEXT_DOMAIN));
                setLoading(false);
            });
    }, [campaignId, requestId, token]);

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
                    __("The amount could not be calculated.", TEXT_DOMAIN),
                );
            }

            const data = await response.json().catch(() => ({}));
            setTotalToPay(Number(data.total_amount ?? 0));
            setPricingBreakdown(
                Array.isArray(data.pricing_breakdown) ? data.pricing_breakdown : [],
            );
            return Number(data.total_amount ?? 0);
        } catch (err: any) {
            setError(
                err.message ||
                __("An error occurred while calculating the amount.", TEXT_DOMAIN),
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

    const updateParticipant = (index: number, field: string, value: any) => {
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

    const removeParticipant = (index: number) => {
        const nextParticipants =
            participants.length === 1
                ? [emptyParticipant()]
                : participants.filter(
                    (_, participantIndex) => participantIndex !== index,
                );
        setParticipants(nextParticipants);
        setSelectedParticipantIndex(Math.max(0, nextParticipants.length - 1));
    };

    const canGoToContact = useMemo<boolean>(() => participants.every((participant) => {
        const basicInfo =
            !!participant.firstname &&
            !!participant.lastname &&
            !!participant.birthdate &&
            !!participant.lesson_id;

        const minorInfo =
            !isParticipantMinor(participant.birthdate) ||
            !!(participant.tutor1 &&
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
    }), [participants]);

    const canGoToReviews = useMemo<boolean>(() =>
        !!contact.firstname &&
        !!contact.lastname &&
        !!contact.email &&
        !!contact.phone &&
        participants.every((participant) => {
            const basicInfo =
                !!participant.firstname &&
                !!participant.lastname &&
                !!participant.birthdate &&
                !!participant.lesson_id;

            const minorInfo =
                !isParticipantMinor(participant.birthdate) ||
                !!(participant.tutor1 &&
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
        }), [contact, participants]);

    const handleNext = () => {
        if (!canGoToContact) {
            setError(
                __(
                    "Please complete the information for each participant before proceeding.",
                    TEXT_DOMAIN,
                ),
            );
            return;
        }
        setError("");
        setStep(1);
    };

    const handleSubmit = async () => {
        if (!canGoToReviews) {
            setError(
                __(
                    "Please complete the contact information and the information for each participant.",
                    TEXT_DOMAIN,
                ),
            );
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const payload = {
                contact: {
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
                    body: JSON.stringify(
                        {
                            request_id: requestId,
                            token: token,
                            data: payload
                        }),
                },
            );

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(
                    data.message ||
                    __("The registration could not be saved.", TEXT_DOMAIN),
                );
            }

            const data = await response.json().catch(() => ({}));

            if (data.paymentUrl) {
                window.location.href = data.paymentUrl; // Redirect to payment URL if provided
            }

            setSuccess(true);
            setStep(2);
        } catch (err: any) {
            setError(
                err.message ||
                __("An error occurred during registration.", TEXT_DOMAIN),
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
                        {__("Registration Successful!", TEXT_DOMAIN)}
                    </Typography>
                    <Typography>
                        {__(
                            "Thank you for your registration. We will contact you shortly.",
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
        __("Review", TEXT_DOMAIN),
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
                    canNext={canGoToContact}
                />
            )}

            {step === 1 && (
                <ContactStep
                    contact={contact}
                    onChangeContact={(field: string, value: any) =>
                        setContact((current) => ({ ...current, [field]: value }))
                    }
                    onBack={() => setStep(0)}
                    onNext={() => {
                        if (!canGoToReviews) {
                            setError(
                                __(
                                    "Please complete the contact information and the information for each participant.",
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
                    canNext={canGoToReviews}
                />
            )}

            {step === 2 && (
                <ReviewStep
                    contact={contact}
                    participants={participants}
                    lessons={lessons}
                    totalToPay={totalToPay}
                    onBack={() => setStep(1)}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                />
            )}
        </Box>
    );
}