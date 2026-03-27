import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import MembersServices from "../../services/members";
import SubscriptionsService from "../../services/subscription";
import { useNavigate, useParams } from "react-router";

export default function MemberAddPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    birthdate: "",
  });

  const handleSave = async () => {
    const res = await MembersServices.exists({
      firstname: data.firstname,
      lastname: data.lastname,
      birthdate: new Date(data.birthdate),
    });

    let member;
    if (res.exists) {
      console.log("Member already exists, using existing member", res.id);
      member = { id: res.id };
    } else {
      console.log("Creating new member", data);
      member = await MembersServices.create({
        ...data,
        birthdate: new Date(data.birthdate),
      });
    }

    const subscription = await SubscriptionsService.create(campaignId!, {
      member_id: member.id,
    });

    navigate(`/campaign/${campaignId}/subscriptions/${subscription.id}/edit`);
  };

  return (
    <Dialog open={true} onClose={() => navigate(-1)}>
      <DialogTitle>Add Member</DialogTitle>
      <DialogContent>
        <form>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            value={data.firstname}
            onChange={(e) => setData({ ...data, firstname: e.target.value })}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            value={data.lastname}
            onChange={(e) => setData({ ...data, lastname: e.target.value })}
          />
          <TextField
            label="Birthdate"
            type="date"
            fullWidth
            margin="normal"
            value={data.birthdate}
            onChange={(e) => setData({ ...data, birthdate: e.target.value })}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
