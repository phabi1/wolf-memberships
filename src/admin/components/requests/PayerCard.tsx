import Box from "@mui/material/Box";
import { Request } from "../../models/request";
import Card from "@mui/material/Card";
export function PayerCard({ request }: { request: Request }) {
    return (
        <Card sx={{ p: 2, mb: 2 }}>
            <Box>
                {request.firstname} {request.lastname}
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
                <Box>
                    <strong>Email:</strong> {request.email}
                </Box>
                <Box>
                    <strong>Phone:</strong> {request.phone}
                </Box>
            </Box>
        </Card>
    );
}