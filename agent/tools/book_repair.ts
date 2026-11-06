import { defineTool } from "eve/tools";
import { z } from "zod";
import { getService, quoteCents, bookSlot, formatUsd } from "../lib/shop.js";

const APPROVAL_THRESHOLD_CENTS = 10000; // $100.00

export default defineTool({
    description:
        "Book one or more services into an open slot for a customer's bike. " +
        "Returns the confirmation and the total quote.",
    inputSchema: z.object({
        serviceIds: z
            .array(z.string())
            .min(1)
            .describe("Service ids from lookup_service."),
        slotId: z.string().describe("An open slot id from check_availability."),
        bikeLabel: z.string().optional().describe("Which of the customer's bikes this is for."),
    }),
    approval: {
        request: ({ toolInput }) =>
            quoteCents(toolInput?.serviceIds ?? []) > APPROVAL_THRESHOLD_CENTS,
        prompt: ({ input }) =>
            `Book ${input.serviceIds.map((id) => getService(id)?.name ?? id).join(" + ")} ` +
            `for ${formatUsd(quoteCents(input.serviceIds))}?`,
    },
    async execute({ serviceIds, slotId, bikeLabel }) {
        const names = serviceIds.map((id) => getService(id)?.name ?? id);
        const total = quoteCents(serviceIds);
        const summary = `${names.join(" + ")}${bikeLabel ? ` (${bikeLabel})` : ""}`;
        const slot = bookSlot(slotId, summary);
        return {
            booked: true,
            when: slot.label,
            services: names,
            total: formatUsd(total),
        };
    },
});