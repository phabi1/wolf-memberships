import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MemberForm, { MemerFormData } from "../../components/member/MemberForm";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import MemberService from "../../services/members";

export default function MemberEditPage() {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<MemerFormData>({
    firstname: "",
    lastname: "",
    birthdate: "",
    license_number: "",
    wheels: [],
    contacts: [],
  });

  const handleSave = () => {
    MemberService.update(memberId as string, {})
      .then((data) => {
        navigate(-1);
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
      });
  };

  useEffect(() => {
    if (memberId) {
      MemberService.item(memberId)
        .then((member) => {
          setData({
            firstname: member.firstname,
            lastname: member.lastname,
            birthdate: member.birthdate,
            license_number: member.license_number || "",
            wheels: [], // Assuming you will fetch or determine the wheels separately
            contacts: [], // Assuming you will fetch or determine the contacts separately
          });
        })
        .catch(() => {
          // Handle error, e.g., show an error message
        });
    }
  }, [memberId]);

  return (
    <Dialog open={true} onClose={() => {}}>
      <DialogTitle>Edit Member</DialogTitle>
      <DialogContent>
        <MemberForm data={data} onDataChange={(data) => {
            setData(data);
        }} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
