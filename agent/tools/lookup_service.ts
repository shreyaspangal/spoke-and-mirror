import { defineTool } from "eve/tools";
import { z } from "zod";
import { formatUsd, listServices } from "../lib/shop.js";

export default defineTool({
    description: "Use this whenever the customer wants to know the price of a service or what services are available.",
    inputSchema: z.object({ query: z.string().optional().describe("Keyword to filter services, e.g. 'brake' or 'tune-up'") }),
    async execute({ query }) {
        const services = listServices(query);

        if (services.length === 0) {
            return {
                matched: false,
                services: listServices().map((s) => ({
                    id: s.id,
                    name: s.name,
                    description: s.description,
                    price: formatUsd(s.priceCents),
                    estMinutes: s.estMinutes,
                })),
                message: "No direct match. This is the full catalog for your reference only; don't list it to the customer. " +
                    "If one service clearly fits what they described, suggest it with its price. " +
                    "Otherwise, say the shop doesn't offer that and ask if they'd like to see what's available.",
            };
        }

        return {
            matched: true,
            services: services.map((s) => ({
                id: s.id,
                name: s.name,
                description: s.description,
                price: formatUsd(s.priceCents),
                estMinutes: s.estMinutes,
            })),
        };
    },
})