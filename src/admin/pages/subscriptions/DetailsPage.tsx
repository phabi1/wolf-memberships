import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import ContactsForm from "../../components/subscriptions/ContactsForm";
import SessionsForm from "../../components/subscriptions/SessionsForm";
import { MemberAvatar } from "../../components/ui/Avatar";
import UiCollection from "../../components/ui/Collection";
import UiPage from "../../components/ui/Page";
import { MemberDetails } from "../../models/member-details";
import { Subscription } from "../../models/subscription";
import MemberService from "../../services/members";
import SubscriptionService from "../../services/subscriptions";



function SessionItem({ session }: { session: any }) {
  return (
    <div>{session.lesson.title}</div>
  );
}

function WheelItem({ wheel }: { wheel: any }) {
  return (
    <div>{wheel.name}</div>
  );
}

function SubscriptionDetails({ subscription, member, sessions }: { subscription: Subscription, member: MemberDetails | null, sessions: any[] }) {

  const handleAddContact = () => {
    // Implement contact addition logic here
  }

  const handleRemoveContact = (contact: any) => {
    // Implement contact removal logic here
  }

  const handleAddSession = () => {
    // Implement session addition logic here
  }

  const handleRemoveSession = (session: any) => {
    // Implement session removal logic here
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <MemberAvatar url={member?.avatar_url} gender={member?.gender} />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h4" gutterBottom>
            {member ? `${member.firstname} ${member.lastname}` : ''}
          </Typography>
        </Box>
      </Box>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          License type: {subscription ? subscription.license_type : ''}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Subscribed at: {subscription ? new Date(subscription.subscribed_at * 1000).toLocaleString() : ''}
        </Typography>
      </Paper>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Contacts
        </Typography>
        <ContactsForm member={member} contacts={subscription?.contacts || []} onAddContact={handleAddContact} onRemoveContact={handleRemoveContact} />
      </Paper>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sessions
        </Typography>
        <SessionsForm subscription={subscription} sessions={sessions} onAddSession={handleAddSession} onRemoveSession={handleRemoveSession} />
      </Paper>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Wheels
        </Typography>
        <UiCollection items={member?.wheels || []} renderItem={(wheel) => (
          <WheelItem wheel={wheel} />
        )} />
      </Paper>
    </>
  );
}

export default function SubscriptionDetailsPage() {
  const { campaignId, subscriptionId } = useParams();

  const [loading, setLoading] = useState(true);

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [member, setMember] = useState<MemberDetails | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setLoading(true);
      if (subscriptionId) {
        return SubscriptionService.item(campaignId as string, subscriptionId as string)
          .then((subscription) => Promise.all([
            MemberService.item(subscription.member.id.toString()),
            SubscriptionService.fetchSessions(campaignId as string, subscriptionId as string)
          ])
            .then(([member, sessions]) => ({ subscription, member, sessions })))
          .then(({ subscription, member, sessions }) => {
            setSubscription(subscription);
            setMember(member);
            setSessions(sessions);
          })

      } else {
        setSubscription(null);
        setMember(null);
        setSessions([]);
      }
    })
      .catch(() => {
        // Handle error, e.g., show an error message
      })
      .finally(() => {
        setLoading(false);
      });
  }, [subscriptionId]);

  return (
    <UiPage title={''} topAction={
      <Link to={`/campaign/${campaignId}/subscriptions`}>
        Back to Subscriptions
      </Link>
    }>
      {loading ? (
        <div>Loading...</div>
      ) : (
        subscription && member && (
          <SubscriptionDetails subscription={subscription} member={member} sessions={sessions} />
        )
      )}
    </UiPage>
  );
}
