import { z } from "zod";

export const CancellationNotificationSchema = z.object({
  method: z.literal("notifications/cancelled"),
  params: z.object({
    requestId: z.string(),
  }),
});

export const StartInstanceSchema = z.object({});

export const GetInstancesSchema = z.object({});

export const StopInstanceSchema = z.object({
  instance_id: z.string().describe("The ID of the instance to stop."),
});

export const BashSchema = z.object({
  instance_id: z
    .string()
    .describe("The ID of the instance to run the command on."),
  command: z.string().describe("The command to run in the instance shell."),
});

export const ActSchema = z.object({
  instance_id: z.string().describe("The ID of the instance to act on."),
  prompt: z.string().describe(`The prompt to act on.
<EXAMPLES>
- Go to https://ycombinator.com/companies, set batch filter to W25, and extract all company names.
- Find the best way to contact Scrapybara.
- Order a Big Mac from McDonald's on Doordash.
</EXAMPLES>
`),
  schema: z
    .any()
    .optional()
    .describe("Optional schema if you want to extract structured output."),
});
