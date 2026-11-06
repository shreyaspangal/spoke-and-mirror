import { connectSlackCredentials } from "@vercel/connect/eve";
import { defaultSlackAuth, slackChannel } from "eve/channels/slack";

export default slackChannel({
  credentials: connectSlackCredentials(
    process.env.SLACK_CONNECTOR ?? "slack/spoke-and-mirror",
  ),

  // Answer @mentions from people; ignore other bots. defaultSlackAuth stamps
  // Slack identity, but does not invent a shop membership tier.
  onAppMention: (ctx, message) =>
    message.author?.isBot ? null : { auth: defaultSlackAuth(message, ctx) },

  // No delivery code needed: eve's default renderer posts the final reply to
  // the thread and shows tool-call narration as the thread status instead.
});
