# Read endpoint inventory

Generated from `spec/trello.openapi.json`. All GET operations are included.
Path placeholders become `by-NAME` directories; pass their values as `--NAME VALUE`.

| Mise task | API path | Description |
| --- | --- | --- |
| `actions:by-id:board:get` | `/1/actions/{id}/board` | Get the Board for an Action |
| `actions:by-id:by-field:get` | `/1/actions/{id}/{field}` | Get a specific field on an Action |
| `actions:by-id:card:get` | `/1/actions/{id}/card` | Get the Card for an Action |
| `actions:by-id:get` | `/1/actions/{id}` | Get an Action |
| `actions:by-id:list:get` | `/1/actions/{id}/list` | Get the List for an Action |
| `actions:by-id:member:get` | `/1/actions/{id}/member` | Get the Member of an Action |
| `actions:by-id:memberCreator:get` | `/1/actions/{id}/memberCreator` | Get the Member Creator of an Action |
| `actions:by-id:organization:get` | `/1/actions/{id}/organization` | Get the Organization of an Action |
| `actions:by-idAction:reactions:by-id:get` | `/1/actions/{idAction}/reactions/{id}` | Get Action's Reaction |
| `actions:by-idAction:reactions:get` | `/1/actions/{idAction}/reactions` | Get Action's Reactions |
| `actions:by-idAction:reactionsSummary:get` | `/1/actions/{idAction}/reactionsSummary` | List Action's summary of Reactions |
| `applications:by-key:compliance:get` | `/1/applications/{key}/compliance` | Get Application's compliance data |
| `batch:get` | `/1/batch` | Batch Requests |
| `boards:by-boardId:actions:get` | `/1/boards/{boardId}/actions` | Get Actions of a Board |
| `boards:by-boardId:boardStars:get` | `/1/boards/{boardId}/boardStars` | Get boardStars on a Board |
| `boards:by-id:boardPlugins:get` | `/1/boards/{id}/boardPlugins` | Get Enabled Power-Ups on Board |
| `boards:by-id:by-field:get` | `/1/boards/{id}/{field}` | Get a field on a Board |
| `boards:by-id:cards:by-filter:get` | `/1/boards/{id}/cards/{filter}` | Get filtered Cards on a Board |
| `boards:by-id:cards:get` | `/1/boards/{id}/cards` | Get Cards on a Board |
| `boards:by-id:checklists:get` | `/1/boards/{id}/checklists` | Get Checklists on a Board |
| `boards:by-id:customFields:get` | `/1/boards/{id}/customFields` | Get Custom Fields for Board |
| `boards:by-id:exports:by-idExport:download:get` | `/1/boards/{id}/exports/{idExport}/download` | Download an Export for a Board |
| `boards:by-id:exports:by-idExport:get` | `/1/boards/{id}/exports/{idExport}` | Get an Export for a Board |
| `boards:by-id:exports:mostRecent:get` | `/1/boards/{id}/exports/mostRecent` | Get a Board's Most Recent Export |
| `boards:by-id:get` | `/1/boards/{id}` | Get a Board |
| `boards:by-id:labels:get` | `/1/boards/{id}/labels` | Get Labels on a Board |
| `boards:by-id:lists:by-filter:get` | `/1/boards/{id}/lists/{filter}` | Get filtered Lists on a Board |
| `boards:by-id:lists:get` | `/1/boards/{id}/lists` | Get Lists on a Board |
| `boards:by-id:members:get` | `/1/boards/{id}/members` | Get the Members of a Board |
| `boards:by-id:memberships:get` | `/1/boards/{id}/memberships` | Get Memberships of a Board |
| `boards:by-id:plugins:get` | `/1/boards/{id}/plugins` | Get Power-Ups on a Board |
| `cards:by-id:actions:get` | `/1/cards/{id}/actions` | Get Actions on a Card |
| `cards:by-id:attachments:by-idAttachment:get` | `/1/cards/{id}/attachments/{idAttachment}` | Get an Attachment on a Card |
| `cards:by-id:attachments:get` | `/1/cards/{id}/attachments` | Get Attachments on a Card |
| `cards:by-id:board:get` | `/1/cards/{id}/board` | Get the Board the Card is on |
| `cards:by-id:by-field:get` | `/1/cards/{id}/{field}` | Get a field on a Card |
| `cards:by-id:checkItem:by-idCheckItem:get` | `/1/cards/{id}/checkItem/{idCheckItem}` | Get checkItem on a Card |
| `cards:by-id:checkItemStates:get` | `/1/cards/{id}/checkItemStates` | Get checkItems on a Card |
| `cards:by-id:checklists:get` | `/1/cards/{id}/checklists` | Get Checklists on a Card |
| `cards:by-id:customFieldItems:get` | `/1/cards/{id}/customFieldItems` | Get Custom Field Items for a Card |
| `cards:by-id:get` | `/1/cards/{id}` | Get a Card |
| `cards:by-id:list:get` | `/1/cards/{id}/list` | Get the List of a Card |
| `cards:by-id:members:get` | `/1/cards/{id}/members` | Get the Members of a Card |
| `cards:by-id:membersVoted:get` | `/1/cards/{id}/membersVoted` | Get Members who have voted on a Card |
| `cards:by-id:pluginData:get` | `/1/cards/{id}/pluginData` | Get pluginData on a Card |
| `cards:by-id:stickers:by-idSticker:get` | `/1/cards/{id}/stickers/{idSticker}` | Get a Sticker on a Card |
| `cards:by-id:stickers:get` | `/1/cards/{id}/stickers` | Get Stickers on a Card |
| `checklists:by-id:board:get` | `/1/checklists/{id}/board` | Get the Board the Checklist is on |
| `checklists:by-id:by-field:get` | `/1/checklists/{id}/{field}` | Get field on a Checklist |
| `checklists:by-id:cards:get` | `/1/checklists/{id}/cards` | Get the Card a Checklist is on |
| `checklists:by-id:checkItems:by-idCheckItem:get` | `/1/checklists/{id}/checkItems/{idCheckItem}` | Get a Checkitem on a Checklist |
| `checklists:by-id:checkItems:get` | `/1/checklists/{id}/checkItems` | Get Checkitems on a Checklist |
| `checklists:by-id:get` | `/1/checklists/{id}` | Get a Checklist |
| `customFields:by-id:get` | `/1/customFields/{id}` | Get a Custom Field |
| `customFields:by-id:options:by-idCustomFieldOption:get` | `/1/customFields/{id}/options/{idCustomFieldOption}` | Get Option of Custom Field dropdown |
| `customFields:by-id:options:get` | `/1/customFields/{id}/options` | Get Options of Custom Field drop down |
| `emoji:get` | `/1/emoji` | List available Emoji |
| `enterprises:by-id:admins:get` | `/1/enterprises/{id}/admins` | Get Enterprise admin Members |
| `enterprises:by-id:auditlog:get` | `/1/enterprises/{id}/auditlog` | Get auditlog data for an Enterprise |
| `enterprises:by-id:claimableOrganizations:get` | `/1/enterprises/{id}/claimableOrganizations` | Get ClaimableOrganizations of an Enterprise |
| `enterprises:by-id:get` | `/1/enterprises/{id}` | Get an Enterprise |
| `enterprises:by-id:members:by-idMember:get` | `/1/enterprises/{id}/members/{idMember}` | Get a Member of Enterprise |
| `enterprises:by-id:members:get` | `/1/enterprises/{id}/members` | Get Members of Enterprise |
| `enterprises:by-id:members:query:get` | `/1/enterprises/{id}/members/query` | Get Users of an Enterprise |
| `enterprises:by-id:organizations:bulk:by-idOrganizations:get` | `/1/enterprises/{id}/organizations/bulk/{idOrganizations}` | Bulk accept a set of organizations to an Enterprise. |
| `enterprises:by-id:organizations:get` | `/1/enterprises/{id}/organizations` | Get Organizations of an Enterprise |
| `enterprises:by-id:pendingOrganizations:get` | `/1/enterprises/{id}/pendingOrganizations` | Get PendingOrganizations of an Enterprise |
| `enterprises:by-id:signupUrl:get` | `/1/enterprises/{id}/signupUrl` | Get signupUrl for Enterprise |
| `enterprises:by-id:transferrable:bulk:by-idOrganizations:get` | `/1/enterprises/{id}/transferrable/bulk/{idOrganizations}` | Get a bulk list of organizations that can be transferred to an enterprise. |
| `enterprises:by-id:transferrable:organization:by-idOrganization:get` | `/1/enterprises/{id}/transferrable/organization/{idOrganization}` | Get whether an organization can be transferred to an enterprise. |
| `labels:by-id:get` | `/1/labels/{id}` | Get a Label |
| `lists:by-id:actions:get` | `/1/lists/{id}/actions` | Get Actions for a List |
| `lists:by-id:board:get` | `/1/lists/{id}/board` | Get the Board a List is on |
| `lists:by-id:cards:get` | `/1/lists/{id}/cards` | Get Cards in a List |
| `lists:by-id:get` | `/1/lists/{id}` | Get a List |
| `members:by-id:actions:get` | `/1/members/{id}/actions` | Get a Member's Actions |
| `members:by-id:boardBackgrounds:by-idBackground:get` | `/1/members/{id}/boardBackgrounds/{idBackground}` | Get a boardBackground of a Member |
| `members:by-id:boardBackgrounds:get` | `/1/members/{id}/boardBackgrounds` | Get Member's custom Board backgrounds |
| `members:by-id:boardStars:by-idStar:get` | `/1/members/{id}/boardStars/{idStar}` | Get a boardStar of Member |
| `members:by-id:boardStars:get` | `/1/members/{id}/boardStars` | Get a Member's boardStars |
| `members:by-id:boards:get` | `/1/members/{id}/boards` | Get Boards that Member belongs to |
| `members:by-id:boardsInvited:get` | `/1/members/{id}/boardsInvited` | Get Boards the Member has been invited to |
| `members:by-id:by-field:get` | `/1/members/{id}/{field}` | Get a field on a Member |
| `members:by-id:cards:get` | `/1/members/{id}/cards` | Get Cards the Member is on |
| `members:by-id:customBoardBackgrounds:by-idBackground:get` | `/1/members/{id}/customBoardBackgrounds/{idBackground}` | Get custom Board Background of Member |
| `members:by-id:customBoardBackgrounds:get` | `/1/members/{id}/customBoardBackgrounds` | Get a Member's custom Board Backgrounds |
| `members:by-id:customEmoji:by-idEmoji:get` | `/1/members/{id}/customEmoji/{idEmoji}` | Get a Member's custom Emoji |
| `members:by-id:customEmoji:get` | `/1/members/{id}/customEmoji` | Get a Member's customEmojis |
| `members:by-id:customStickers:by-idSticker:get` | `/1/members/{id}/customStickers/{idSticker}` | Get a Member's custom Sticker |
| `members:by-id:customStickers:get` | `/1/members/{id}/customStickers` | Get Member's custom Stickers |
| `members:by-id:get` | `/1/members/{id}` | Get a Member |
| `members:by-id:notificationChannelSettings:by-channel:get` | `/1/members/{id}/notificationChannelSettings/{channel}` | Get blocked notification keys of Member on this channel |
| `members:by-id:notificationChannelSettings:get` | `/1/members/{id}/notificationChannelSettings` | Get a Member's notification channel settings |
| `members:by-id:notifications:get` | `/1/members/{id}/notifications` | Get Member's Notifications |
| `members:by-id:organizations:get` | `/1/members/{id}/organizations` | Get Member's Organizations |
| `members:by-id:organizationsInvited:get` | `/1/members/{id}/organizationsInvited` | Get Organizations a Member has been invited to |
| `members:by-id:savedSearches:by-idSearch:get` | `/1/members/{id}/savedSearches/{idSearch}` | Get a saved search |
| `members:by-id:savedSearches:get` | `/1/members/{id}/savedSearches` | Get Member's saved searched |
| `members:by-id:tokens:get` | `/1/members/{id}/tokens` | Get Member's Tokens |
| `notifications:by-id:board:get` | `/1/notifications/{id}/board` | Get the Board a Notification is on |
| `notifications:by-id:by-field:get` | `/1/notifications/{id}/{field}` | Get a field of a Notification |
| `notifications:by-id:card:get` | `/1/notifications/{id}/card` | Get the Card a Notification is on |
| `notifications:by-id:get` | `/1/notifications/{id}` | Get a Notification |
| `notifications:by-id:list:get` | `/1/notifications/{id}/list` | Get the List a Notification is on |
| `notifications:by-id:member:get` | `/1/notifications/{id}/member` | Get the Member a Notification is about (not the creator) |
| `notifications:by-id:memberCreator:get` | `/1/notifications/{id}/memberCreator` | Get the Member who created the Notification |
| `notifications:by-id:organization:get` | `/1/notifications/{id}/organization` | Get a Notification's associated Organization |
| `organizations:by-id:actions:get` | `/1/organizations/{id}/actions` | Get Actions for Organization |
| `organizations:by-id:boards:get` | `/1/organizations/{id}/boards` | Get Boards in an Organization |
| `organizations:by-id:by-field:get` | `/1/organizations/{id}/{field}` | Get field on Organization |
| `organizations:by-id:exports:get` | `/1/organizations/{id}/exports` | Retrieve Organization's Exports |
| `organizations:by-id:get` | `/1/organizations/{id}` | Get an Organization |
| `organizations:by-id:members:get` | `/1/organizations/{id}/members` | Get the Members of an Organization |
| `organizations:by-id:memberships:by-idMembership:get` | `/1/organizations/{id}/memberships/{idMembership}` | Get a Membership of an Organization |
| `organizations:by-id:memberships:get` | `/1/organizations/{id}/memberships` | Get Memberships of an Organization |
| `organizations:by-id:newBillableGuests:by-idBoard:get` | `/1/organizations/{id}/newBillableGuests/{idBoard}` | Get Organizations new billable guests |
| `organizations:by-id:pluginData:get` | `/1/organizations/{id}/pluginData` | Get the pluginData Scoped to Organization |
| `organizations:by-id:tags:get` | `/1/organizations/{id}/tags` | Get Tags of an Organization |
| `plugins:by-id:compliance:memberPrivacy:get` | `/1/plugins/{id}/compliance/memberPrivacy` | Get Plugin's Member privacy compliance |
| `plugins:by-id:get` | `/1/plugins/{id}/` | Get a Plugin |
| `search:get` | `/1/search` | Search Trello |
| `search:members:get` | `/1/search/members/` | Search for Members |
| `tokens:by-token:get` | `/1/tokens/{token}` | Get a Token |
| `tokens:by-token:member:get` | `/1/tokens/{token}/member` | Get Token's Member |
| `tokens:by-token:webhooks:by-idWebhook:get` | `/1/tokens/{token}/webhooks/{idWebhook}` | Get a Webhook belonging to a Token |
| `tokens:by-token:webhooks:get` | `/1/tokens/{token}/webhooks` | Get Webhooks for Token |
| `webhooks:by-id:by-field:get` | `/1/webhooks/{id}/{field}` | Get a field on a Webhook |
| `webhooks:by-id:get` | `/1/webhooks/{id}` | Get a Webhook |
