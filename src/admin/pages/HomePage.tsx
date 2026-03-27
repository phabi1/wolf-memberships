import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Paper from "@mui/material/Paper";

export default function HomePage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/wp-json/wolf-memberships/v1/campaigns")
      .then((res) => res.json())
      .then((data) => setItems(data.items));
  }, []);

  return (
    <>
      <h1>Campaigns</h1>
      <Box
        sx={{
          marginBottom: 2,
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
      >
        {items.map((item) => (
          <Link key={item.id} to={`/campaign/${item.id}`}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>{item.title}</Paper>
          </Link>
        ))}
      </Box>
    </>
  );
}
