import React from "react";
import { notification } from "antd";
import { Color } from "assets/style/Color";

export function notify({
                         message = "",
                         description = undefined as any,
                         txid = "",
                         type = "info",
                         placement = "bottomLeft",
                       }) {
  if (txid) {
    description = <>
      <a
        target="_blank"
        href={`https://testnet.nearblocks.io/txns/${txid}`}
        style={{ color: "#000" }}
      >
        View transaction {txid.slice(0, 8)}...{txid.slice(txid.length - 8)}
      </a>
    </>;
  } else {
    description = <span style={{ color: "#000", opacity: 0.5 }}>{description}</span>
  }
  (notification as any)[type]({
    message: <span style={{ color: "#000" }}>{message}</span>,
    description: (
      <span style={{ color: "#000", opacity: 0.5 }}>{description}</span>
    ),
    placement,
    style: {
      backgroundColor: Color.bgPrimary,
      color: "#fff"
    },
  });
}
