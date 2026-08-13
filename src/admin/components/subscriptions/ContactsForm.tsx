import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from '../forms/Form';
import InputField from '../forms/fields/InputField';
import UiCollection from '../ui/Collection';

function ContactItem({ contact }: { contact: any }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1 }}>
            <div>{contact.lastname} {contact.firstname}</div>
            <div>Email: {contact.email}</div>
            <div>Phone: {contact.phone}</div>
        </Box>
    );
}

export default function ContactsForm({ member, contacts, onAddContact, onRemoveContact }: { member: any, contacts: any[], onAddContact?: () => void, onRemoveContact?: (contact: any) => void }) {

    const [open, setOpen] = useState(false);

    const form = useForm({
        defaultValues: {
            lastname: '',
            firstname: '',
            email: '',
            phone: '',
        },
    });

    const handleAddContact = () => {
        setOpen(true);
    }

    const handleRemoveContact = (contact: any) => {
        if (onRemoveContact) {
            onRemoveContact(contact);
        }
    }

    const handleSaveContact = (data: any) => {
        if (onAddContact) {
            onAddContact();
        }
        setOpen(false);
    }

    return (
        <>
            <UiCollection items={contacts || []} renderItem={(contact) => (
                <ContactItem contact={contact} />
            )} onAddItem={handleAddContact} onRemoveItem={handleRemoveContact} />
            <Dialog open={open} fullWidth maxWidth="sm">
                <DialogTitle>Contact</DialogTitle>
                <DialogContent>
                    <Form form={form} onSubmit={handleSaveContact}>
                        <InputField name="lastname" label="Last Name" required />
                        <InputField name="firstname" label="First Name" required />
                        <InputField name="email" label="Email" type="email" />
                        <InputField name="phone" label="Phone" type="tel" />
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}