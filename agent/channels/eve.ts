import { eveChannel } from "eve/channels/eve";
import { localDev, vercelOidc, type AuthFn } from "eve/channels/auth";

// TEMPORARY testing door: read a tier from a header so we can exercise the
// per-tier playbook locally. We replace this with a real auth policy in 4.3.
const demoTierAuth: AuthFn<Request> = async (request) => {
  const tier = request.headers.get("x-shop-tier");
  if (!tier) return null;
  return {
    attributes: { tier },
    principalType: "user",
    principalId: "demo-customer",
    authenticator: "demo",
  };
};

export default eveChannel({
  // Order matters: first entry to admit the request wins. Keep localDev() so the TUI still works.
  auth: [demoTierAuth, vercelOidc(), localDev()],
});
