import { useEffect, useState } from "react";


export const useHashRoute = () => {
const [hash, setHash] = useState(window.location.hash || "#/");
useEffect(() => {
const onChange = () => setHash(window.location.hash || "#/");
window.addEventListener("hashchange", onChange);
return () => window.removeEventListener("hashchange", onChange);
}, []);
const [path, ...rest] = hash.replace(/^#\//, "").split("/");
return { hash, path, rest };
};