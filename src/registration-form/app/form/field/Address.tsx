import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { __ } from "@wordpress/i18n";

const TEXT_DOMAIN = "wolf-membership";

export function AddressField({ address, onChange }: {
    address: {
        line1?: string;
        line2?: string;
        zipcode?: string;
        city?: string;
        country?: string;
    }, onChange: (address: {
        line1?: string;
        line2?: string;
        zipcode?: string;
        city?: string;
        country?: string;
    }) => void
}) {
    const handleChange = (field: string, value: string) => {
        onChange({
            ...address,
            [field]: value,
        });
    };

    return (
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
            <TextField
                label={__("Line 1", TEXT_DOMAIN)}
                value={address.line1 || ""}
                onChange={(event) => handleChange("line1", event.target.value)}
                fullWidth
                sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}
            />
            <TextField
                label={__("Line 2", TEXT_DOMAIN)}
                value={address.line2 || ""}
                onChange={(event) => handleChange("line2", event.target.value)}
                fullWidth
                sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}
            />
            <TextField
                label={__("Postal Code", TEXT_DOMAIN)}
                value={address.zipcode || ""}
                onChange={(event) => handleChange("zipcode", event.target.value)}
                fullWidth
                required
            />
            <TextField
                label={__("City", TEXT_DOMAIN)}
                value={address.city || ""}
                onChange={(event) => handleChange("city", event.target.value)}
                fullWidth
                required
            />
            <TextField
                label={__("Country", TEXT_DOMAIN)}
                value={address.country || ""}
                onChange={(event) => handleChange("country", event.target.value)}
                fullWidth
                required
            />
        </Box>
    );
}