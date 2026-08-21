import App from "./app/App";
import { createRoot } from "react-dom/client";

document
  .querySelectorAll(".wp-block-wolf-membership-registration-form")
  .forEach((element) => {

    console.log('Loading registration form');

    const searchParams = new URLSearchParams(window.location.search);
    const campaignId = searchParams.get("campaign_id");
    const requestId = searchParams.get("request_id");
    const token = searchParams.get("token");

    console.log("campaignId:", campaignId);
    console.log("requestId:", requestId);
    console.log("token:", token);

    if (campaignId) {
      const root = createRoot(element);
      root.render(
        <App campaignId={campaignId} requestId={requestId} token={token} />,
      );
    }
  });
