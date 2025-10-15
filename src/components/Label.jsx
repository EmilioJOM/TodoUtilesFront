import React from "react";
import { palette } from "../utils/styles.jsx";


export default function Label({ children }) {
return <div style={{ fontSize: 13, color: palette.muted, margin: "6px 0" }}>{children}</div>;
}