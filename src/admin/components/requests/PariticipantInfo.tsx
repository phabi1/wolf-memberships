import type { RequestParticipant } from "../../models/request-participant";

export function ParticipantInfo({ participant }: { participant: RequestParticipant }) {
    return (
        <>
            <div>
                <strong>First Name:</strong> {participant.firstname}<br />
                <strong>Last Name:</strong> {participant.lastname}<br />
                <strong>Email:</strong> {participant.email || "N/A"}<br />
                <strong>Phone:</strong> {participant.phone || "N/A"}<br />
            </div>
            <div>
                {/* Add more participant details here if needed */}
            </div>
        </>
    );
}