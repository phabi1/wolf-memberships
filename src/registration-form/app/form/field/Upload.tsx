import { TEXT_DOMAIN } from "../../utils";
import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { __ } from "@wordpress/i18n";

export function UploadField({ file, onChange }: {
    file: string | null,
    onChange: (file: string | null) => void
}) {
    
    const previewUrl = useMemo(() => {
        if (!file) {
            return '#';
        }
        return file.startsWith("http") ? file : `/wp-content/uploads/${file}`;
    }, [file]);

    const [uploading, setUploading] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRemoveFile = () => {
        setRemoving(true);
        fetch("/wp-json/wolf-memberships/v1/file/upload", {
            method: "DELETE",
            body: JSON.stringify({ uri: file }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.success) {
                    console.error("File removal failed:", data.error);
                }
            })
            .catch((error) => {
                console.error("File removal error:", error);
            }).finally(() => {
                setRemoving(false);
                onChange(null);
            });

    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const data = new FormData();
        data.append("file", event.target.files ? event.target.files[0] : new Blob());
        // Upload file
        setUploading(true);
        fetch("/wp-json/wolf-memberships/v1/file/upload", {
            method: "POST",
            body: data,
        }).then((response) => response.json())
            .then((data) => {
                setUploading(false);
                onChange(data.uri);
            })
            .catch((error) => {
                setUploading(false);
                console.error("File upload error:", error);
            });

        const selectedFile = event.target.files ? event.target.files[0] : null;
        onChange(selectedFile ? selectedFile.name : null);
    };

    if (uploading) {
        return (
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="body2">
                    {__("Uploading...", TEXT_DOMAIN)}
                </Typography>
            </Box>
        );
    }

    if (removing) {
        return (
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="body2">
                    {__("Removing...", TEXT_DOMAIN)}
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {file ? (
                <Box>
                    <Typography variant="body2">
                        {__("Selected file:", TEXT_DOMAIN)} <a href={previewUrl} target="_blank" rel="noopener noreferrer">{file}</a>
                    </Typography>
                    <Button variant="outlined" color="secondary" onClick={handleRemoveFile}>
                        {__("Remove", TEXT_DOMAIN)}
                    </Button>
                </Box>
            ) : (
                <Button variant="contained" component="label">
                    {__("Upload", TEXT_DOMAIN)}
                    <input type="file" hidden onChange={handleFileChange} />
                </Button>
            )}
        </Box>
    );
}