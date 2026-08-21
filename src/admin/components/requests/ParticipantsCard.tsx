import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { RequestParticipant } from "../../models/request-participant";
import { ParticipantInfo } from "./PariticipantInfo";

export function ParticipantsCard({ participants }: { participants: RequestParticipant[] }) {

    if (participants.length === 0) {
        return (
            <Card sx={{ p: 2, mb: 2 }}>
                <Typography>No participants available.</Typography>
            </Card>
        );
    }
    return (<>
        {participants.map((participant, index) => (
            <Accordion key={index}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                >
                    <Typography component="span">{participant.firstname} {participant.lastname}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ParticipantInfo participant={participant} />
                </AccordionDetails>
            </Accordion>
        ))}
    </>
    );
}