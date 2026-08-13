import { Member } from "../../models/member";
import { useMemo } from "react";
import Avatar from "@mui/material/Avatar";

import { forwardRef } from "react";

const MemberAvatar = forwardRef<HTMLDivElement, { url?: string; gender?: "male" | "female" }>(({ url, gender }, ref) => {

    const avatarUrl = useMemo(() => {
        if (url) {
            return url;
        } else if (gender === "male") {
            return "/wp-content/plugins/wolf-membership/public/images/avatar-male.jpg";
        } else if (gender === "female") {
            return "/wp-content/plugins/wolf-membership/public/images/avatar-female.jpg";
        }
        return "/wp-content/plugins/wolf-membership/public/images/avatar-default.png";
    }, [url, gender]);

    return (
        <Avatar src={avatarUrl} />
    );
});

export { MemberAvatar };