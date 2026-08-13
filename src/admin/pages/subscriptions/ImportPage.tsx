import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { Link, useNavigate, useParams } from "react-router";
import Form from "../../components/forms/Form";
import { useState } from "react";
import SubscriptionsService from "../../services/subscriptions";
import Input from "../../components/forms/fields/InputField";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import FileField from "../../components/forms/fields/FileField";

export default function ImportPage() {
    const { campaignId } = useParams();
    const navigate = useNavigate();

    const [view, setView] = useState<'form' | 'processing' | 'result' | 'error'>('form');

    const form = useForm({
        defaultValues: {
            file: null,
        },
    });

    const handleImport = (data: any) => {
        setView('processing');
        SubscriptionsService.import(campaignId!, data.file)
            .then(() => {
                setView('result');
            })
            .catch((error) => {
                // Handle error, e.g., show an error message
                setView('error');
            });
    }

    const handleRetry = () => {
        form.reset();
        setView('form');
    }

    const handleClose = () => {
        navigate(`/campaign/${campaignId}/subscriptions`);
    }

    return (
        <Dialog open={true} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Import Members for Campaign {campaignId}</DialogTitle>
            <DialogContent>
                {view === 'form' && (
                    <Form form={form} onSubmit={handleImport}>
                        <FileField name="file" accept=".csv" />
                        <Box>
                            <Button type="button" onClick={handleClose}>Close</Button>
                            <Button type="button" onClick={form.handleSubmit(handleImport)}>Import</Button>
                        </Box>
                    </Form>
                )}
                {view === 'processing' && (
                    <div>Processing import...</div>
                )}
                {view === 'result' && (
                    <Box>
                        <div>Import completed!</div>
                        <Button onClick={handleClose}>Close</Button>
                    </Box>
                )}
                {view === 'error' && (
                    <Box>
                        <div>There was an error during import. Please try again.</div>
                        <Button onClick={handleRetry}>Retry</Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}