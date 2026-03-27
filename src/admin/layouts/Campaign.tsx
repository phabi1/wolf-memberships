import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router";

export default function LayoutCampaign() {
  const { campaignId } = useParams();

  const [campaign, setCampaign] = useState<any>(null);

  useEffect(() => {
    fetch(`/wp-json/wolf-memberships/v1/campaigns/${campaignId}`)
      .then((res) => res.json())
      .then((data) => setCampaign(data));
  }, [campaignId]);

  return (
    <Box sx={{ display: "flex", height: "100%", minHeight: "100vh" }}>
      <Box component="nav" sx={{ width: 240, padding: 2 }}>
        <Paper>
          <div>
            {campaign && (
              <Box
                sx={{
                  padding: 2,
                  textAlign: "center",
                  borderBottom: "1px solid #eee",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {campaign.title}
                </Typography>
              </Box>
            )}
          </div>
          <List>
            <ListItem component={Link} to={`/campaign/${campaignId}`}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem component={Link} to={`/campaign/${campaignId}/members`}>
              <ListItemText primary="Members" />
            </ListItem>
            <ListItem component={Link} to={`/campaign/${campaignId}/lessons`}>
              <ListItemText primary="Lessons" />
            </ListItem>
            <ListItem
              component={Link}
              to={`/campaign/${campaignId}/periods`}
            >
              <ListItemText primary="Schedulers" />
            </ListItem>
          </List>
        </Paper>
        <div>
          <Link to="/">Back to campaigns</Link>
        </div>
      </Box>
      <Box component="main" sx={{ flex: 1, padding: 2 }}>
        <div>
          <Outlet />
        </div>
      </Box>
    </Box>
  );
}
