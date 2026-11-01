import { defineTool } from "eve/tools";
import { z } from "zod";
import { formatUsd, listServices } from "../lib/shop.js";

export default defineTool({
    description: "Use this whenever the customer wants to know the price of a service or what services are available.",
    inputSchema: z.object({ query: z.string().optional().describe("Keyword to filter services, e.g. 'brake' or 'tune-up'") }),
    async execute({ query }) {
        const services = listServices(query);

        if (services.length === 0) {
            return { matched: false, services: [], message: "No services found matching your query. Don't quote a price; offer the list instead." };
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