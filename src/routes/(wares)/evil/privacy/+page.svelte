<article class="mx-auto max-w-3xl space-y-4 py-8 leading-relaxed">
    <h1 class="text-3xl font-bold">Evil Announcer Privacy Policy</h1>
    <p>Last updated: 9 October 2026</p>

    <p>
        Evil Announcer is operated by Zelo101 for the HTwins Central Discord server. This policy
        explains what information the bot processes, why it uses that information, where records are
        kept, and how to contact us about your data.
    </p>
    <p>
        HTwins Central also uses Logbote, a separate bot with its own privacy policy. This policy
        covers Evil Announcer, including its use of information obtained from other services for
        moderation and ban appeals.
    </p>
    <p>
        For privacy questions, help opting out of message-content tracking, or requests to correct
        or delete your data, email
        <a class="underline" href="mailto:hello@zelo.dev">hello@zelo.dev</a>.
    </p>

    <h2 class="mt-8 text-2xl font-semibold">When We Process Data</h2>
    <p>
        Evil Announcer can receive information when you join, leave, or participate in HTwins
        Central, change your server profile, or use its commands. It also processes information
        supplied through reports and ban appeals, including appeals from people who are no longer
        server members.
    </p>
    <p>
        Evil Announcer is intended only for people who meet Discord's minimum age requirement. We do
        not knowingly collect data from anyone below that requirement.
    </p>

    <h2 class="mt-8 text-2xl font-semibold">Information We Use and Why</h2>
    <ul class="space-y-2">
        <li>
            <strong>Member information:</strong> Discord user IDs, usernames, nicknames, roles,
            account creation time, and server membership information support onboarding, account-age
            checks,
            <code>@OFF</code> mention protection, and moderation actions.
        </li>
        <li>
            <strong>Newcomer progress:</strong> A newcomer's user ID, message count, newcomer/established
            status, and record timestamps are used to manage onboarding and the "New" role, which restricts
            file uploads and embeds. We retain records of completed onboarding so members do not need
            to repeat it if they leave and later rejoin. Message text is not stored in the newcomer record.
        </li>
        <li>
            <strong>Messages and attachments:</strong> The bot processes message text, attachment
            and embed information, mentions, channel and message IDs, timestamps, and author
            information for posting rules, including PluralKit rule reminders, <code>@OFF</code>
            mention protection, detection of suspected compromised accounts, adaptive slowmode, and member
            reports. A notice sent to the author of an
            <code>@OFF</code> violation can include their original message text and attachment links.
        </li>
        <li>
            <strong>Reports and support requests:</strong> We process the reporter's identity, their explanation,
            the reported message, and recent channel context so moderators can investigate, including
            if the original messages are later deleted. The latest ten available messages in the relevant
            channel can be included in a context image stored in Discord. Context can include messages
            from people other than the reporter or reported member. A report's content and context image
            are deleted when the report is resolved.
        </li>
        <li>
            <strong>Reactions:</strong> The bot processes reactions for suggestion voting and moderation.
            To help staff investigate abuse involving quickly removed reactions, it temporarily caches
            reaction information and can log a user's identity, the reaction, and a message link when
            a tracked reaction is removed within ten seconds.
        </li>
        <li>
            <strong>Moderator selection:</strong> Report routing uses the configured moderator IDs
            and their server nicknames and roles. It excludes moderators whose nickname includes
            <code>on break</code> or <code>mod break</code>. The bot does not enable the Presence
            intent, check online or client status, or track moderator activity for selection.
        </li>
        <li>
            <strong>Ban appeals:</strong> We process appeal submissions, including usernames, email
            addresses, appeal text, dates, the restriction being appealed, and staff votes
            associated with moderators' Discord IDs. When a submitted appeal is processed, the bot
            sends the appellant's Discord user ID to the warning-log bot's service at
            <code>lgbt.dunkyl.net</code> and posts the returned moderation history alongside that appeal
            for review. This service is operated by another community moderator for servers in the same
            fandom or network as HTwins Central. These records can include information from those other
            servers, network bans, and age-ban indicators. Evil Announcer does not provide staff with
            a command to look up arbitrary users' histories; this lookup runs automatically as part of
            the appeal workflow.
        </li>
    </ul>
    <p>
        The deleted-media archive and emoji/sticker usage analytics are disabled. Evil Announcer no
        longer uploads deleted attachments to Amazon S3 or collects new emoji/sticker usage totals
        through those services. It also no longer runs the suggestion-link anti-boosting service.
    </p>

    <h2 class="mt-8 text-2xl font-semibold">Where Information Is Stored and Shared</h2>
    <ul class="space-y-2">
        <li>
            <strong>Discord:</strong> Reports, channel-context images, reaction logs, moderation alerts,
            and appeal information are posted to the configured staff channels. Support threads can include
            the member requesting help and moderators. Access follows Discord's channel and thread permissions.
        </li>
        <li>
            <strong>Our bot host and PocketBase database:</strong> PocketBase stores newcomer progress
            and records of completed onboarding, not message content. The bot processes message content
            in memory without storing it off-platform. Report-context payloads are prepared in memory
            and sent directly to the rendering service without being written to a local file.
        </li>
        <li>
            <strong>Amazon Web Services:</strong> When a report-context image is requested, the latest
            ten messages available in the relevant channel, including message and author information,
            are sent to an AWS-hosted rendering service for temporary processing. The resulting image
            is posted in Discord. Message content and rendered context images are not retained off-platform.
        </li>
        <li>
            <strong>Google Sheets:</strong> Appeal submissions and staff votes are held in the spreadsheet
            used for the ban-appeal workflow.
        </li>
        <li>
            <strong>The warning-log bot's service:</strong> When processing a submitted ban appeal,
            the appellant's Discord user ID is shared with <code>lgbt.dunkyl.net</code> to retrieve existing
            moderation records for that appeal. Evil Announcer does not maintain its own off-platform
            database of those warning and ban histories.
        </li>
    </ul>
    <p>
        We do not sell your data or use message content for advertising or to train or fine-tune
        machine-learning or AI models.
    </p>

    <h2 class="mt-8 text-2xl font-semibold">Retention and Deletion</h2>
    <p>
        We retain records for as long as needed for the onboarding, support, moderation, and appeal
        purposes described in this policy. Some API data, such as member progress and appeal
        records, may be retained for more than 30 days. This does not include off-platform storage
        of message content.
    </p>
    <ul class="space-y-2">
        <li>
            <strong>Newcomer records:</strong> If you leave before completing onboarding, the bot deletes
            your progress record when it receives your leave event. If you have completed onboarding,
            we retain your record after you leave so you do not need to repeat onboarding if you rejoin.
            You can request deletion of that record at any time. Leaving does not automatically erase
            separate reports, appeals, or moderation logs.
        </li>
        <li>
            <strong>Report-context payloads:</strong> These are processed temporarily without retaining
            message content or context images off-platform. The rendered image is posted in Discord and
            follows the report handling described below.
        </li>
        <li>
            <strong>Discord reports and support threads:</strong> Resolving a report deletes its displayed
            content and attachments, including the context image. Staff can also delete support threads.
            Unresolved reports and separate logs are not subject to a fixed automatic expiry in the bot.
            Deleting the original message does not automatically delete copies already included in reports.
        </li>
        <li>
            <strong>Appeal records:</strong> The bot does not automatically delete the Google Sheets record
            when an appeal closes.
        </li>
        <li>
            <strong>In-memory data:</strong> Working caches are held in the bot's running process. Report
            routing does not collect presence data or maintain activity histories.
        </li>
    </ul>
    <p>
        We delete API data when it is no longer needed for the bot's stated purposes or when
        deletion is required following a user request, under Discord's terms, or by applicable law.
        Records without an automatic expiry are handled manually.
    </p>

    <h2 class="mt-8 text-2xl font-semibold">Your Choices and Requests</h2>
    <p>
        You can opt out of having your message content data tracked. Email
        <a class="underline" href="mailto:hello@zelo.dev">hello@zelo.dev</a> for help opting out, to ask
        about your data, or to request its correction or deletion. Include your Discord user ID and enough
        detail to identify your request. We may need to verify that the request concerns your data. Do
        not send your Discord password or account token.
    </p>
    <p>
        Correction and deletion requests are handled manually by the operator. For newcomer data, we
        locate the PocketBase record using your Discord user ID and remove the record, including its
        stored message count and newcomer or completion status. If you delete your onboarding
        completion record, you may need to repeat onboarding if you leave and rejoin. We will review
        requests and promptly delete API data when required by
        <a
            class="underline"
            href="https://support-dev.discord.com/hc/en-us/articles/8562894815383-Discord-Developer-Terms-of-Service"
            >Discord's terms</a
        > or applicable law. Requests can also cover copies under our control in Discord reports and the
        appeal spreadsheet. We may need to coordinate with a service provider for copies it holds on our
        behalf. Independently operated services, including Logbote, have their own policies and request
        processes.
    </p>
    <p>
        Opting out of message-content tracking and requesting deletion of existing records are
        separate choices. Moderators can also exclude themselves from report selection by including
        <code>on break</code> or <code>mod break</code> in their server nickname.
    </p>

    <h2 class="mt-8 text-2xl font-semibold">Security</h2>
    <p>
        We encrypt the API data we store off-platform at rest. We also use Discord channel and
        thread permissions to control access to moderation reports and account credentials to
        restrict access to PocketBase and Google Sheets. No method of transmission or electronic
        storage is completely secure. Contact us if you believe information handled by Evil
        Announcer has been exposed or misused.
    </p>

    <h2 class="mt-8 text-2xl font-semibold">Changes to This Policy</h2>
    <p>
        We may update this policy as the bot's functionality or data practices change. We will post
        the updated policy and revise the date above.
    </p>
</article>
