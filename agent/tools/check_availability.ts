import { defineTool } from "eve/tools";
import { z } from "zod";
import { listOpenSlots } from "../lib/shop.js";

export default defineTool({
    description: "List the repair slots that are currently open for booking. Use this whenever the customer asks when they can come in or wants to schedule a service.",
    inputSchema: z.object({}),
    async execute() {
        return listOpenSlots().map((s) => ({ slotId: s.id, when: s.label }));
    },
});
