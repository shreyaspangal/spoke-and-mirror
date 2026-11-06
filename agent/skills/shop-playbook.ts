import { defineDynamic, defineSkill } from "eve/skills";

const PLAYBOOKS: Record<string, { title: string; markdown: string }> = {
    pro: {
        title: "Pro / shop-mechanic playbook",
        markdown:
            "This caller is a pro mechanic. Talk torque specs and part numbers freely, " +
            "skip the absolute basics, and recommend a Full Overhaul when the symptoms " +
            "justify it. Reference /workspace/torque-specs.md for fastener values.",
    },
    member: {
        title: "Member playbook",
        markdown:
            "This caller is a shop member. Mention the 10% labor discount on bookings, " +
            "and offer a free loaner bike whenever a job will keep their bike overnight.",
    },
};

export default defineDynamic((ctx) => {
    // Tier comes from the authenticated identity stamped at the door, never from chat text.
    const tier = ctx.session.auth.current?.attributes.tier;
    const key = Array.isArray(tier) ? tier[0] : tier;
    const playbook = typeof key === "string" ? PLAYBOOKS[key] : undefined;
    if (!playbook) return null; // no tier → no playbook, just the standard desk
    return defineSkill({
        description:
            `The current caller is a verified ${key}-tier customer. ` +
            `Load this before advising, quoting, or booking: it contains that tier's standing conventions.`,
        content: `# ${playbook.title}\n\n${playbook.markdown}`,
    });
});
