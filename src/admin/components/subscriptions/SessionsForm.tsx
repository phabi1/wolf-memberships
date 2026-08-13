import { useState } from 'react';
import UiCollection from '../ui/Collection';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Form from '../forms/Form';
import SelectField from '../forms/fields/SelectField';
import { useForm } from 'react-hook-form';

function SessionItem({ session }: { session: any }) {
    return (
        <Box>
            <div>{session.lesson.title}</div>
        </Box>
    );
}

export default function SessionsForm({ subscription, sessions, onAddSession, onRemoveSession }: { subscription: any, sessions: any[], onAddSession?: () => void, onRemoveSession?: (session: any) => void }) {

    const [open, setOpen] = useState(false);

    const form = useForm({
        defaultValues: {
            session: '',
        },
    });

    const handleAddSession = () => {
        setOpen(true);
    }

    const handleRemoveSession = (session: any) => {
        if (onRemoveSession) {
            onRemoveSession(session);
        }
    }

    const handleSaveSession = (data: any) => {
        if (onAddSession) {
            onAddSession();
        }
        setOpen(false);
    }

    return (
        <>
            <UiCollection items={sessions || []} renderItem={(session) => (
                <SessionItem session={session} />
            )} onAddItem={handleAddSession} onRemoveItem={handleRemoveSession} />
            <Dialog open={open} fullWidth maxWidth="sm">
                <DialogTitle>Session</DialogTitle>
                <DialogContent>
                    <Form form={form} onSubmit={handleSaveSession}>
                        <SelectField name="session" label="Session" required options={[]} />
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}