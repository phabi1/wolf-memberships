import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import MembersServices from "../../services/members";
import SubscriptionsService from "../../services/subscriptions";
import { useNavigate, useParams } from "react-router";
import Form from "../../components/forms/Form";
import InputField from "../../components/forms/fields/InputField";
import useToast from "../../hooks/use-toast";

type MemberInputs = {
  firstname: string;
  lastname: string;
  birthdate: string;
};

export default function MemberAddPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const showToast = useToast();

  const form = useForm<MemberInputs>({
    defaultValues: {
      firstname: '',
      lastname: '',
      birthdate: '',
    },
    mode: 'onChange',
  });

  const [processing, setProcessing] = useState(false);
  const handleSave = async (data: MemberInputs) => {
    try {
      setProcessing(true);

      const res = await MembersServices.exists({
        firstname: data.firstname,
        lastname: data.lastname,
        birthdate: new Date(data.birthdate)
      });

      let member;
      if (res.exists) {
        member = { id: res.id };
      } else {
        member = await MembersServices.create({
          ...data,
          birthdate: new Date(data.birthdate),
        });
      }

      const subscription = await SubscriptionsService.create(campaignId!, {
        member_id: member.id,
      });

      navigate(`/campaign/${campaignId}/subscriptions/${subscription.id}/edit`);
      showToast('Member added successfully', 'success');

    } catch (error) {
      console.error("Error adding member:", error);
      showToast('Error adding member', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const canSave = useMemo(() => {
    if (processing) return false;
    return true;
  }, [processing]);

  return (

    <Form form={form} onSubmit={handleSave}>
      <Dialog open={true} onClose={() => navigate(-1)}>
        <DialogTitle>Add Member</DialogTitle>
        <DialogContent>
          <InputField name="firstname" label="First Name" />
          <InputField name="lastname" label="Last Name" />
          <InputField name="birthdate" label="Birthdate" type="date" />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="button" onClick={form.handleSubmit(handleSave)} disabled={!canSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Form >
  );
}
