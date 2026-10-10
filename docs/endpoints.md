# Read endpoint inventory

Generated from `spec/trello.openapi.json`. All GET operations are included.
Path placeholders become `by-NAME` directories; pass their values as `--NAME VALUE`.

| Mise task | API path | Description |
| --- | --- | --- |
| `api:actions:by-id:board:get` | `/1/actions/{id}/board` | Get the Board for an Action |
| `api:actions:by-id:by-field:get` | `/1/actions/{id}/{field}` | Get a specific field on an Action |
| `api:actions:by-id:card:get` | `/1/actions/{id}/card` | Get the Card for an Action |
| `api:actions:by-id:get` | `/1/actions/{id}` | Get an Action |
| `api:actions:by-id:list:get` | `/1/actions/{id}/list` | Get the List for an Action |
| `api:actions:by-id:member:get` | `/1/actions/{id}/member` | Get the Member of an Action |
| `api:actions:by-id:memberCreator:get` | `/1/actions/{id}/memberCreator` | Get the Member Creator of an Action |
| `api:actions:by-id:organization:get` | `/1/actions/{id}/organization` | Get the Organization of an Action |
| `api:actions:by-idAction:reactions:by-id:get` | `/1/actions/{idAction}/reactions/{id}` | Get Action's Reaction |
| `api:actions:by-idAction:reactions:get` | `/1/actions/{idAction}/reactions` | Get Action's Reactions |
| `api:actions:by-idAction:reactionsSummary:get` | `/1/actions/{idAction}/reactionsSummary` | List Action's summary of Reactions |
| `api:applications:by-key:compliance:get` | `/1/applications/{key}/compliance` | Get Application's compliance data |
| `api:batch:get` | `/1/batch` | Batch Requests |
| `api:boards:by-boardId:actions:get` | `/1/boards/{boardId}/actions` | Get Actions of a Board |
| `api:boards:by-boardId:boardStars:get` | `/1/boards/{boardId}/boardStars` | Get boardStars on a Board |
| `api:boards:by-id:boardPlugins:get` | `/1/boards/{id}/boardPlugins` | Get Enabled Power-Ups on Board |
| `api:boards:by-id:by-field:get` | `/1/boards/{id}/{field}` | Get a field on a Board |
| `api:boards:by-id:cards:by-filter:get` | `/1/boards/{id}/cards/{filter}` | Get filtered Cards on a Board |
| `api:boards:by-id:cards:get` | `/1/boards/{id}/cards` | Get Cards on a Board |
| `api:boards:by-id:checklists:get` | `/1/boards/{id}/checklists` | Get Checklists on a Board |
| `api:boards:by-id:customFields:get` | `/1/boards/{id}/customFields` | Get Custom Fields for Board |
| `api:boards:by-id:exports:by-idExport:download:get` | `/1/boards/{id}/exports/{idExport}/download` | Download an Export for a Board |
| `api:boards:by-id:exports:by-idExport:get` | `/1/boards/{id}/exports/{idExport}` | Get an Export for a Board |
| `api:boards:by-id:exports:mostRecent:get` | `/1/boards/{id}/exports/mostRecent` | Get a Board's Most Recent Export |
| `api:boards:by-id:get` | `/1/boards/{id}` | Get a Board |
| `api:boards:by-id:labels:get` | `/1/boards/{id}/labels` | Get Labels on a Board |
| `api:boards:by-id:lists:by-filter:get` | `/1/boards/{id}/lists/{filter}` | Get filtered Lists on a Board |
| `api:boards:by-id:lists:get` | `/1/boards/{id}/lists` | Get Lists on a Board |
| `api:boards:by-id:members:get` | `/1/boards/{id}/members` | Get the Members of a Board |
| `api:boards:by-id:memberships:get` | `/1/boards/{id}/memberships` | Get Memberships of a Board |
| `api:boards:by-id:plugins:get` | `/1/boards/{id}/plugins` | Get Power-Ups on a Board |
| `api:cards:by-id:actions:get` | `/1/cards/{id}/actions` | Get Actions on a Card |
| `api:cards:by-id:attachments:by-idAttachment:get` | `/1/cards/{id}/attachments/{idAttachment}` | Get an Attachment on a Card |
| `api:cards:by-id:attachments:get` | `/1/cards/{id}/attachments` | Get Attachments on a Card |
| `api:cards:by-id:board:get` | `/1/cards/{id}/board` | Get the Board the Card is on |
| `api:cards:by-id:by-field:get` | `/1/cards/{id}/{field}` | Get a field on a Card |
| `api:cards:by-id:checkItem:by-idCheckItem:get` | `/1/cards/{id}/checkItem/{idCheckItem}` | Get checkItem on a Card |
| `api:cards:by-id:checkItemStates:get` | `/1/cards/{id}/checkItemStates` | Get checkItems on a Card |
| `api:cards:by-id:checklists:get` | `/1/cards/{id}/checklists` | Get Checklists on a Card |
| `api:cards:by-id:customFieldItems:get` | `/1/cards/{id}/customFieldItems` | Get Custom Field Items for a Card |
| `api:cards:by-id:get` | `/1/cards/{id}` | Get a Card |
| `api:cards:by-id:list:get` | `/1/cards/{id}/list` | Get the List of a Card |
| `api:cards:by-id:members:get` | `/1/cards/{id}/members` | Get the Members of a Card |
| `api:cards:by-id:membersVoted:get` | `/1/cards/{id}/membersVoted` | Get Members who have voted on a Card |
| `api:cards:by-id:pluginData:get` | `/1/cards/{id}/pluginData` | Get pluginData on a Card |
| `api:cards:by-id:stickers:by-idSticker:get` | `/1/cards/{id}/stickers/{idSticker}` | Get a Sticker on a Card |
| `api:cards:by-id:stickers:get` | `/1/cards/{id}/stickers` | Get Stickers on a Card |
| `api:checklists:by-id:board:get` | `/1/checklists/{id}/board` | Get the Board the Checklist is on |
| `api:checklists:by-id:by-field:get` | `/1/checklists/{id}/{field}` | Get field on a Checklist |
| `api:checklists:by-id:cards:get` | `/1/checklists/{id}/cards` | Get the Card a Checklist is on |
| `api:checklists:by-id:checkItems:by-idCheckItem:get` | `/1/checklists/{id}/checkItems/{idCheckItem}` | Get a Checkitem on a Checklist |
| `api:checklists:by-id:checkItems:get` | `/1/checklists/{id}/checkItems` | Get Checkitems on a Checklist |
| `api:checklists:by-id:get` | `/1/checklists/{id}` | Get a Checklist |
| `api:customFields:by-id:get` | `/1/customFields/{id}` | Get a Custom Field |
| `api:customFields:by-id:options:by-idCustomFieldOption:get` | `/1/customFields/{id}/options/{idCustomFieldOption}` | Get Option of Custom Field dropdown |
| `api:customFields:by-id:options:get` | `/1/customFields/{id}/options` | Get Options of Custom Field drop down |
| `api:emoji:get` | `/1/emoji` | List available Emoji |
| `api:enterprises:by-id:admins:get` | `/1/enterprises/{id}/admins` | Get Enterprise admin Members |
| `api:enterprises:by-id:auditlog:get` | `/1/enterprises/{id}/auditlog` | Get auditlog data for an Enterprise |
| `api:enterprises:by-id:claimableOrganizations:get` | `/1/enterprises/{id}/claimableOrganizations` | Get ClaimableOrganizations of an Enterprise |
| `api:enterprises:by-id:get` | `/1/enterprises/{id}` | Get an Enterprise |
| `api:enterprises:by-id:members:by-idMember:get` | `/1/enterprises/{id}/members/{idMember}` | Get a Member of Enterprise |
| `api:enterprises:by-id:members:get` | `/1/enterprises/{id}/members` | Get Members of Enterprise |
| `api:enterprises:by-id:members:query:get` | `/1/enterprises/{id}/members/query` | Get Users of an Enterprise |
| `api:enterprises:by-id:organizations:bulk:by-idOrganizations:get` | `/1/enterprises/{id}/organizations/bulk/{idOrganizations}` | Bulk accept a set of organizations to an Enterprise. |
| `api:enterprises:by-id:organizations:get` | `/1/enterprises/{id}/organizations` | Get Organizations of an Enterprise |
| `api:enterprises:by-id:pendingOrganizations:get` | `/1/enterprises/{id}/pendingOrganizations` | Get PendingOrganizations of an Enterprise |
| `api:enterprises:by-id:signupUrl:get` | `/1/enterprises/{id}/signupUrl` | Get signupUrl for Enterprise |
| `api:enterprises:by-id:transferrable:bulk:by-idOrganizations:get` | `/1/enterprises/{id}/transferrable/bulk/{idOrganizations}` | Get a bulk list of organizations that can be transferred to an enterprise. |
| `api:enterprises:by-id:transferrable:organization:by-idOrganization:get` | `/1/enterprises/{id}/transferrable/organization/{idOrganization}` | Get whether an organization can be transferred to an enterprise. |
| `api:labels:by-id:get` | `/1/labels/{id}` | Get a Label |
| `api:lists:by-id:actions:get` | `/1/lists/{id}/actions` | Get Actions for a List |
| `api:lists:by-id:board:get` | `/1/lists/{id}/board` | Get the Board a List is on |
| `api:lists:by-id:cards:get` | `/1/lists/{id}/cards` | Get Cards in a List |
| `api:lists:by-id:get` | `/1/lists/{id}` | Get a List |
| `api:members:by-id:actions:get` | `/1/members/{id}/actions` | Get a Member's Actions |
| `api:members:by-id:boardBackgrounds:by-idBackground:get` | `/1/members/{id}/boardBackgrounds/{idBackground}` | Get a boardBackground of a Member |
| `api:members:by-id:boardBackgrounds:get` | `/1/members/{id}/boardBackgrounds` | Get Member's custom Board backgrounds |
| `api:members:by-id:boardStars:by-idStar:get` | `/1/members/{id}/boardStars/{idStar}` | Get a boardStar of Member |
| `api:members:by-id:boardStars:get` | `/1/members/{id}/boardStars` | Get a Member's boardStars |
| `api:members:by-id:boards:get` | `/1/members/{id}/boards` | Get Boards that Member belongs to |
| `api:members:by-id:boardsInvited:get` | `/1/members/{id}/boardsInvited` | Get Boards the Member has been invited to |
| `api:members:by-id:by-field:get` | `/1/members/{id}/{field}` | Get a field on a Member |
| `api:members:by-id:cards:get` | `/1/members/{id}/cards` | Get Cards the Member is on |
| `api:members:by-id:customBoardBackgrounds:by-idBackground:get` | `/1/members/{id}/customBoardBackgrounds/{idBackground}` | Get custom Board Background of Member |
| `api:members:by-id:customBoardBackgrounds:get` | `/1/members/{id}/customBoardBackgrounds` | Get a Member's custom Board Backgrounds |
| `api:members:by-id:customEmoji:by-idEmoji:get` | `/1/members/{id}/customEmoji/{idEmoji}` | Get a Member's custom Emoji |
| `api:members:by-id:customEmoji:get` | `/1/members/{id}/customEmoji` | Get a Member's customEmojis |
| `api:members:by-id:customStickers:by-idSticker:get` | `/1/members/{id}/customStickers/{idSticker}` | Get a Member's custom Sticker |
| `api:members:by-id:customStickers:get` | `/1/members/{id}/customStickers` | Get Member's custom Stickers |
| `api:members:by-id:get` | `/1/members/{id}` | Get a Member |
| `api:members:by-id:notificationChannelSettings:by-channel:get` | `/1/members/{id}/notificationChannelSettings/{channel}` | Get blocked notification keys of Member on this channel |
| `api:members:by-id:notificationChannelSettings:get` | `/1/members/{id}/notificationChannelSettings` | Get a Member's notification channel settings |
| `api:members:by-id:notifications:get` | `/1/members/{id}/notifications` | Get Member's Notifications |
| `api:members:by-id:organizations:get` | `/1/members/{id}/organizations` | Get Member's Organizations |
| `api:members:by-id:organizationsInvited:get` | `/1/members/{id}/organizationsInvited` | Get Organizations a Member has been invited to |
| `api:members:by-id:savedSearches:by-idSearch:get` | `/1/members/{id}/savedSearches/{idSearch}` | Get a saved search |
| `api:members:by-id:savedSearches:get` | `/1/members/{id}/savedSearches` | Get Member's saved searched |
| `api:members:by-id:tokens:get` | `/1/members/{id}/tokens` | Get Member's Tokens |
| `api:notifications:by-id:board:get` | `/1/notifications/{id}/board` | Get the Board a Notification is on |
| `api:notifications:by-id:by-field:get` | `/1/notifications/{id}/{field}` | Get a field of a Notification |
| `api:notifications:by-id:card:get` | `/1/notifications/{id}/card` | Get the Card a Notification is on |
| `api:notifications:by-id:get` | `/1/notifications/{id}` | Get a Notification |
| `api:notifications:by-id:list:get` | `/1/notifications/{id}/list` | Get the List a Notification is on |
| `api:notifications:by-id:member:get` | `/1/notifications/{id}/member` | Get the Member a Notification is about (not the creator) |
| `api:notifications:by-id:memberCreator:get` | `/1/notifications/{id}/memberCreator` | Get the Member who created the Notification |
| `api:notifications:by-id:organization:get` | `/1/notifications/{id}/organization` | Get a Notification's associated Organization |
| `api:organizations:by-id:actions:get` | `/1/organizations/{id}/actions` | Get Actions for Organization |
| `api:organizations:by-id:boards:get` | `/1/organizations/{id}/boards` | Get Boards in an Organization |
| `api:organizations:by-id:by-field:get` | `/1/organizations/{id}/{field}` | Get field on Organization |
| `api:organizations:by-id:exports:get` | `/1/organizations/{id}/exports` | Retrieve Organization's Exports |
| `api:organizations:by-id:get` | `/1/organizations/{id}` | Get an Organization |
| `api:organizations:by-id:members:get` | `/1/organizations/{id}/members` | Get the Members of an Organization |
| `api:organizations:by-id:memberships:by-idMembership:get` | `/1/organizations/{id}/memberships/{idMembership}` | Get a Membership of an Organization |
| `api:organizations:by-id:memberships:get` | `/1/organizations/{id}/memberships` | Get Memberships of an Organization |
| `api:organizations:by-id:newBillableGuests:by-idBoard:get` | `/1/organizations/{id}/newBillableGuests/{idBoard}` | Get Organizations new billable guests |
| `api:organizations:by-id:pluginData:get` | `/1/organizations/{id}/pluginData` | Get the pluginData Scoped to Organization |
| `api:organizations:by-id:tags:get` | `/1/organizations/{id}/tags` | Get Tags of an Organization |
| `api:plugins:by-id:compliance:memberPrivacy:get` | `/1/plugins/{id}/compliance/memberPrivacy` | Get Plugin's Member privacy compliance |
| `api:plugins:by-id:get` | `/1/plugins/{id}/` | Get a Plugin |
| `api:search:get` | `/1/search` | Search Trello |
| `api:search:members:get` | `/1/search/members/` | Search for Members |
| `api:tokens:by-token:get` | `/1/tokens/{token}` | Get a Token |
| `api:tokens:by-token:member:get` | `/1/tokens/{token}/member` | Get Token's Member |
| `api:tokens:by-token:webhooks:by-idWebhook:get` | `/1/tokens/{token}/webhooks/{idWebhook}` | Get a Webhook belonging to a Token |
| `api:tokens:by-token:webhooks:get` | `/1/tokens/{token}/webhooks` | Get Webhooks for Token |
| `api:webhooks:by-id:by-field:get` | `/1/webhooks/{id}/{field}` | Get a field on a Webhook |
| `api:webhooks:by-id:get` | `/1/webhooks/{id}` | Get a Webhook |
