import { useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import "./editor.scss";

export default function Edit() {
  return (
    <>
      <div {...useBlockProps()}>
        <p>{__("Registration Campaign Form", "wolf-membership")}</p>
      </div>
    </>
  );
}
