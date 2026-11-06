import { defineTool } from "eve/tools";
import { z } from "zod";
import { garage } from "../lib/garage.js";

export default defineTool({
    description:
        "Read the bikes the shop has on file for this customer. Check this before asking " +
        "the customer to repeat details about a bike they've mentioned by name.",
    inputSchema: z.object({}),
    async execute() {
        return garage.get();
    },
});
