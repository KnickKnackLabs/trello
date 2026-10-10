# API endpoint inventory

Generated from `spec/trello.openapi.json`. All documented HTTP operations are included.
Path placeholders become `by-NAME` directories; pass their values as `--NAME VALUE`.

| Mise task | Method | API path | Description |
| --- | --- | --- | --- |
| `api:actions:by-id:board:get` | GET | `/1/actions/{id}/board` | Get the Board for an Action |
| `api:actions:by-id:by-field:get` | GET | `/1/actions/{id}/{field}` | Get a specific field on an Action |
| `api:actions:by-id:card:get` | GET | `/1/actions/{id}/card` | Get the Card for an Action |
| `api:actions:by-id:delete` | DELETE | `/1/actions/{id}` | Delete an Action |
| `api:actions:by-id:get` | GET | `/1/actions/{id}` | Get an Action |
| `api:actions:by-id:list:get` | GET | `/1/actions/{id}/list` | Get the List for an Action |
| `api:actions:by-id:member:get` | GET | `/1/actions/{id}/member` | Get the Member of an Action |
| `api:actions:by-id:memberCreator:get` | GET | `/1/actions/{id}/memberCreator` | Get the Member Creator of an Action |
| `api:actions:by-id:organization:get` | GET | `/1/actions/{id}/organization` | Get the Organization of an Action |
| `api:actions:by-id:put` | PUT | `/1/actions/{id}` | Update an Action |
| `api:actions:by-id:text:put` | PUT | `/1/actions/{id}/text` | Update a Comment Action |
| `api:actions:by-idAction:reactions:by-id:delete` | DELETE | `/1/actions/{idAction}/reactions/{id}` | Delete Action's Reaction |
| `api:actions:by-idAction:reactions:by-id:get` | GET | `/1/actions/{idAction}/reactions/{id}` | Get Action's Reaction |
| `api:actions:by-idAction:reactions:get` | GET | `/1/actions/{idAction}/reactions` | Get Action's Reactions |
| `api:actions:by-idAction:reactions:post` | POST | `/1/actions/{idAction}/reactions` | Create Reaction for Action |
| `api:actions:by-idAction:reactionsSummary:get` | GET | `/1/actions/{idAction}/reactionsSummary` | List Action's summary of Reactions |
| `api:applications:by-key:compliance:get` | GET | `/1/applications/{key}/compliance` | Get Application's compliance data |
| `api:batch:get` | GET | `/1/batch` | Batch Requests |
| `api:boards:by-boardId:actions:get` | GET | `/1/boards/{boardId}/actions` | Get Actions of a Board |
| `api:boards:by-boardId:boardStars:get` | GET | `/1/boards/{boardId}/boardStars` | Get boardStars on a Board |
| `api:boards:by-id:boardPlugins:by-idPlugin:delete` | DELETE | `/1/boards/{id}/boardPlugins/{idPlugin}` | Disable a Power-Up on a Board |
| `api:boards:by-id:boardPlugins:get` | GET | `/1/boards/{id}/boardPlugins` | Get Enabled Power-Ups on Board |
| `api:boards:by-id:boardPlugins:post` | POST | `/1/boards/{id}/boardPlugins` | Enable a Power-Up on a Board |
| `api:boards:by-id:by-field:get` | GET | `/1/boards/{id}/{field}` | Get a field on a Board |
| `api:boards:by-id:calendarKey:generate:post` | POST | `/1/boards/{id}/calendarKey/generate` | Create a calendarKey for a Board |
| `api:boards:by-id:cards:by-filter:get` | GET | `/1/boards/{id}/cards/{filter}` | Get filtered Cards on a Board |
| `api:boards:by-id:cards:get` | GET | `/1/boards/{id}/cards` | Get Cards on a Board |
| `api:boards:by-id:checklists:get` | GET | `/1/boards/{id}/checklists` | Get Checklists on a Board |
| `api:boards:by-id:customFields:get` | GET | `/1/boards/{id}/customFields` | Get Custom Fields for Board |
| `api:boards:by-id:delete` | DELETE | `/1/boards/{id}` | Delete a Board |
| `api:boards:by-id:emailKey:generate:post` | POST | `/1/boards/{id}/emailKey/generate` | Create a emailKey for a Board |
| `api:boards:by-id:exports:by-idExport:delete` | DELETE | `/1/boards/{id}/exports/{idExport}` | Delete an Export for a Board |
| `api:boards:by-id:exports:by-idExport:download:get` | GET | `/1/boards/{id}/exports/{idExport}/download` | Download an Export for a Board |
| `api:boards:by-id:exports:by-idExport:get` | GET | `/1/boards/{id}/exports/{idExport}` | Get an Export for a Board |
| `api:boards:by-id:exports:mostRecent:get` | GET | `/1/boards/{id}/exports/mostRecent` | Get a Board's Most Recent Export |
| `api:boards:by-id:exports:post` | POST | `/1/boards/{id}/exports` | Create an Export for a Board |
| `api:boards:by-id:get` | GET | `/1/boards/{id}` | Get a Board |
| `api:boards:by-id:idTags:post` | POST | `/1/boards/{id}/idTags` | Create a Tag for a Board |
| `api:boards:by-id:labels:get` | GET | `/1/boards/{id}/labels` | Get Labels on a Board |
| `api:boards:by-id:labels:post` | POST | `/1/boards/{id}/labels` | Create a Label on a Board |
| `api:boards:by-id:lists:by-filter:get` | GET | `/1/boards/{id}/lists/{filter}` | Get filtered Lists on a Board |
| `api:boards:by-id:lists:get` | GET | `/1/boards/{id}/lists` | Get Lists on a Board |
| `api:boards:by-id:lists:post` | POST | `/1/boards/{id}/lists` | Create a List on a Board |
| `api:boards:by-id:markAsViewed:post` | POST | `/1/boards/{id}/markAsViewed` | Mark Board as viewed |
| `api:boards:by-id:members:by-idMember:delete` | DELETE | `/1/boards/{id}/members/{idMember}` | Remove Member from Board |
| `api:boards:by-id:members:by-idMember:put` | PUT | `/1/boards/{id}/members/{idMember}` | Add a Member to a Board |
| `api:boards:by-id:members:get` | GET | `/1/boards/{id}/members` | Get the Members of a Board |
| `api:boards:by-id:members:put` | PUT | `/1/boards/{id}/members` | Invite Member to Board via email |
| `api:boards:by-id:memberships:by-idMembership:put` | PUT | `/1/boards/{id}/memberships/{idMembership}` | Update Membership of Member on a Board |
| `api:boards:by-id:memberships:get` | GET | `/1/boards/{id}/memberships` | Get Memberships of a Board |
| `api:boards:by-id:myPrefs:emailPosition:put` | PUT | `/1/boards/{id}/myPrefs/emailPosition` | Update emailPosition Pref on a Board |
| `api:boards:by-id:myPrefs:idEmailList:put` | PUT | `/1/boards/{id}/myPrefs/idEmailList` | Update idEmailList Pref on a Board |
| `api:boards:by-id:myPrefs:showSidebar:put` | PUT | `/1/boards/{id}/myPrefs/showSidebar` | Update showSidebar Pref on a Board |
| `api:boards:by-id:myPrefs:showSidebarActivity:put` | PUT | `/1/boards/{id}/myPrefs/showSidebarActivity` | Update showSidebarActivity Pref on a Board |
| `api:boards:by-id:myPrefs:showSidebarBoardActions:put` | PUT | `/1/boards/{id}/myPrefs/showSidebarBoardActions` | Update showSidebarBoardActions Pref on a Board |
| `api:boards:by-id:myPrefs:showSidebarMembers:put` | PUT | `/1/boards/{id}/myPrefs/showSidebarMembers` | Update showSidebarMembers Pref on a Board |
| `api:boards:by-id:plugins:get` | GET | `/1/boards/{id}/plugins` | Get Power-Ups on a Board |
| `api:boards:by-id:put` | PUT | `/1/boards/{id}` | Update a Board |
| `api:boards:post` | POST | `/1/boards/` | Create a Board |
| `api:cards:by-id:actions:by-idAction:comments:delete` | DELETE | `/1/cards/{id}/actions/{idAction}/comments` | Delete a comment on a Card |
| `api:cards:by-id:actions:by-idAction:comments:put` | PUT | `/1/cards/{id}/actions/{idAction}/comments` | Update Comment Action on a Card |
| `api:cards:by-id:actions:comments:post` | POST | `/1/cards/{id}/actions/comments` | Add a new comment to a Card |
| `api:cards:by-id:actions:get` | GET | `/1/cards/{id}/actions` | Get Actions on a Card |
| `api:cards:by-id:attachments:by-idAttachment:delete` | DELETE | `/1/cards/{id}/attachments/{idAttachment}` | Delete an Attachment on a Card |
| `api:cards:by-id:attachments:by-idAttachment:get` | GET | `/1/cards/{id}/attachments/{idAttachment}` | Get an Attachment on a Card |
| `api:cards:by-id:attachments:get` | GET | `/1/cards/{id}/attachments` | Get Attachments on a Card |
| `api:cards:by-id:attachments:post` | POST | `/1/cards/{id}/attachments` | Create Attachment On Card |
| `api:cards:by-id:board:get` | GET | `/1/cards/{id}/board` | Get the Board the Card is on |
| `api:cards:by-id:by-field:get` | GET | `/1/cards/{id}/{field}` | Get a field on a Card |
| `api:cards:by-id:checkItem:by-idCheckItem:delete` | DELETE | `/1/cards/{id}/checkItem/{idCheckItem}` | Delete checkItem on a Card |
| `api:cards:by-id:checkItem:by-idCheckItem:get` | GET | `/1/cards/{id}/checkItem/{idCheckItem}` | Get checkItem on a Card |
| `api:cards:by-id:checkItem:by-idCheckItem:put` | PUT | `/1/cards/{id}/checkItem/{idCheckItem}` | Update a checkItem on a Card |
| `api:cards:by-id:checkItemStates:get` | GET | `/1/cards/{id}/checkItemStates` | Get checkItems on a Card |
| `api:cards:by-id:checklists:by-idChecklist:delete` | DELETE | `/1/cards/{id}/checklists/{idChecklist}` | Delete a Checklist on a Card |
| `api:cards:by-id:checklists:get` | GET | `/1/cards/{id}/checklists` | Get Checklists on a Card |
| `api:cards:by-id:checklists:post` | POST | `/1/cards/{id}/checklists` | Create Checklist on a Card |
| `api:cards:by-id:customFieldItems:get` | GET | `/1/cards/{id}/customFieldItems` | Get Custom Field Items for a Card |
| `api:cards:by-id:delete` | DELETE | `/1/cards/{id}` | Delete a Card |
| `api:cards:by-id:get` | GET | `/1/cards/{id}` | Get a Card |
| `api:cards:by-id:idLabels:by-idLabel:delete` | DELETE | `/1/cards/{id}/idLabels/{idLabel}` | Remove a Label from a Card |
| `api:cards:by-id:idLabels:post` | POST | `/1/cards/{id}/idLabels` | Add a Label to a Card |
| `api:cards:by-id:idMembers:by-idMember:delete` | DELETE | `/1/cards/{id}/idMembers/{idMember}` | Remove a Member from a Card |
| `api:cards:by-id:idMembers:post` | POST | `/1/cards/{id}/idMembers` | Add a Member to a Card |
| `api:cards:by-id:labels:post` | POST | `/1/cards/{id}/labels` | Create a new Label on a Card |
| `api:cards:by-id:list:get` | GET | `/1/cards/{id}/list` | Get the List of a Card |
| `api:cards:by-id:markAssociatedNotificationsRead:post` | POST | `/1/cards/{id}/markAssociatedNotificationsRead` | Mark a Card's Notifications as read |
| `api:cards:by-id:members:get` | GET | `/1/cards/{id}/members` | Get the Members of a Card |
| `api:cards:by-id:membersVoted:by-idMember:delete` | DELETE | `/1/cards/{id}/membersVoted/{idMember}` | Remove a Member's Vote on a Card |
| `api:cards:by-id:membersVoted:get` | GET | `/1/cards/{id}/membersVoted` | Get Members who have voted on a Card |
| `api:cards:by-id:membersVoted:post` | POST | `/1/cards/{id}/membersVoted` | Add Member vote to Card |
| `api:cards:by-id:pluginData:get` | GET | `/1/cards/{id}/pluginData` | Get pluginData on a Card |
| `api:cards:by-id:put` | PUT | `/1/cards/{id}` | Update a Card |
| `api:cards:by-id:stickers:by-idSticker:delete` | DELETE | `/1/cards/{id}/stickers/{idSticker}` | Delete a Sticker on a Card |
| `api:cards:by-id:stickers:by-idSticker:get` | GET | `/1/cards/{id}/stickers/{idSticker}` | Get a Sticker on a Card |
| `api:cards:by-id:stickers:by-idSticker:put` | PUT | `/1/cards/{id}/stickers/{idSticker}` | Update a Sticker on a Card |
| `api:cards:by-id:stickers:get` | GET | `/1/cards/{id}/stickers` | Get Stickers on a Card |
| `api:cards:by-id:stickers:post` | POST | `/1/cards/{id}/stickers` | Add a Sticker to a Card |
| `api:cards:by-idCard:checklist:by-idChecklist:checkItem:by-idCheckItem:put` | PUT | `/1/cards/{idCard}/checklist/{idChecklist}/checkItem/{idCheckItem}` | Update Checkitem on Checklist on Card |
| `api:cards:by-idCard:customField:by-idCustomField:item:put` | PUT | `/1/cards/{idCard}/customField/{idCustomField}/item` | Update Custom Field item on Card |
| `api:cards:by-idCard:customFields:put` | PUT | `/1/cards/{idCard}/customFields` | Update Multiple Custom Field items on Card |
| `api:cards:post` | POST | `/1/cards` | Create a new Card |
| `api:checklists:by-id:board:get` | GET | `/1/checklists/{id}/board` | Get the Board the Checklist is on |
| `api:checklists:by-id:by-field:get` | GET | `/1/checklists/{id}/{field}` | Get field on a Checklist |
| `api:checklists:by-id:by-field:put` | PUT | `/1/checklists/{id}/{field}` | Update field on a Checklist |
| `api:checklists:by-id:cards:get` | GET | `/1/checklists/{id}/cards` | Get the Card a Checklist is on |
| `api:checklists:by-id:checkItems:by-idCheckItem:delete` | DELETE | `/1/checklists/{id}/checkItems/{idCheckItem}` | Delete Checkitem from Checklist |
| `api:checklists:by-id:checkItems:by-idCheckItem:get` | GET | `/1/checklists/{id}/checkItems/{idCheckItem}` | Get a Checkitem on a Checklist |
| `api:checklists:by-id:checkItems:get` | GET | `/1/checklists/{id}/checkItems` | Get Checkitems on a Checklist |
| `api:checklists:by-id:checkItems:post` | POST | `/1/checklists/{id}/checkItems` | Create Checkitem on Checklist |
| `api:checklists:by-id:delete` | DELETE | `/1/checklists/{id}` | Delete a Checklist |
| `api:checklists:by-id:get` | GET | `/1/checklists/{id}` | Get a Checklist |
| `api:checklists:by-id:put` | PUT | `/1/checklists/{id}` | Update a Checklist |
| `api:checklists:post` | POST | `/1/checklists` | Create a Checklist |
| `api:customFields:by-id:delete` | DELETE | `/1/customFields/{id}` | Delete a Custom Field definition |
| `api:customFields:by-id:get` | GET | `/1/customFields/{id}` | Get a Custom Field |
| `api:customFields:by-id:options:by-idCustomFieldOption:delete` | DELETE | `/1/customFields/{id}/options/{idCustomFieldOption}` | Delete Option of Custom Field dropdown |
| `api:customFields:by-id:options:by-idCustomFieldOption:get` | GET | `/1/customFields/{id}/options/{idCustomFieldOption}` | Get Option of Custom Field dropdown |
| `api:customFields:by-id:options:get` | GET | `/1/customFields/{id}/options` | Get Options of Custom Field drop down |
| `api:customFields:by-id:options:post` | POST | `/1/customFields/{id}/options` | Add Option to Custom Field dropdown |
| `api:customFields:by-id:put` | PUT | `/1/customFields/{id}` | Update a Custom Field definition |
| `api:customFields:post` | POST | `/1/customFields` | Create a new Custom Field on a Board |
| `api:emoji:get` | GET | `/1/emoji` | List available Emoji |
| `api:enterprises:${id}:enterpriseJoinRequest:bulk:put` | PUT | `/1/enterprises/${id}/enterpriseJoinRequest/bulk` | Decline enterpriseJoinRequests from one organization or a bulk list of organizations. |
| `api:enterprises:by-id:admins:by-idMember:delete` | DELETE | `/1/enterprises/{id}/admins/{idMember}` | Remove a Member as admin from Enterprise. |
| `api:enterprises:by-id:admins:by-idMember:put` | PUT | `/1/enterprises/{id}/admins/{idMember}` | Update Member to be admin of Enterprise |
| `api:enterprises:by-id:admins:get` | GET | `/1/enterprises/{id}/admins` | Get Enterprise admin Members |
| `api:enterprises:by-id:auditlog:get` | GET | `/1/enterprises/{id}/auditlog` | Get auditlog data for an Enterprise |
| `api:enterprises:by-id:claimableOrganizations:get` | GET | `/1/enterprises/{id}/claimableOrganizations` | Get ClaimableOrganizations of an Enterprise |
| `api:enterprises:by-id:get` | GET | `/1/enterprises/{id}` | Get an Enterprise |
| `api:enterprises:by-id:members:by-idMember:deactivated:put` | PUT | `/1/enterprises/{id}/members/{idMember}/deactivated` | Deactivate a Member of an Enterprise. |
| `api:enterprises:by-id:members:by-idMember:get` | GET | `/1/enterprises/{id}/members/{idMember}` | Get a Member of Enterprise |
| `api:enterprises:by-id:members:by-idMember:licensed:put` | PUT | `/1/enterprises/{id}/members/{idMember}/licensed` | Update a Member's licensed status |
| `api:enterprises:by-id:members:get` | GET | `/1/enterprises/{id}/members` | Get Members of Enterprise |
| `api:enterprises:by-id:members:query:get` | GET | `/1/enterprises/{id}/members/query` | Get Users of an Enterprise |
| `api:enterprises:by-id:organizations:bulk:by-idOrganizations:get` | GET | `/1/enterprises/{id}/organizations/bulk/{idOrganizations}` | Bulk accept a set of organizations to an Enterprise. |
| `api:enterprises:by-id:organizations:by-idOrg:delete` | DELETE | `/1/enterprises/{id}/organizations/{idOrg}` | Delete an Organization from an Enterprise. |
| `api:enterprises:by-id:organizations:get` | GET | `/1/enterprises/{id}/organizations` | Get Organizations of an Enterprise |
| `api:enterprises:by-id:organizations:put` | PUT | `/1/enterprises/{id}/organizations` | Transfer an Organization to an Enterprise. |
| `api:enterprises:by-id:pendingOrganizations:get` | GET | `/1/enterprises/{id}/pendingOrganizations` | Get PendingOrganizations of an Enterprise |
| `api:enterprises:by-id:signupUrl:get` | GET | `/1/enterprises/{id}/signupUrl` | Get signupUrl for Enterprise |
| `api:enterprises:by-id:tokens:post` | POST | `/1/enterprises/{id}/tokens` | Create an auth Token for an Enterprise. |
| `api:enterprises:by-id:transferrable:bulk:by-idOrganizations:get` | GET | `/1/enterprises/{id}/transferrable/bulk/{idOrganizations}` | Get a bulk list of organizations that can be transferred to an enterprise. |
| `api:enterprises:by-id:transferrable:organization:by-idOrganization:get` | GET | `/1/enterprises/{id}/transferrable/organization/{idOrganization}` | Get whether an organization can be transferred to an enterprise. |
| `api:labels:by-id:by-field:put` | PUT | `/1/labels/{id}/{field}` | Update a field on a label |
| `api:labels:by-id:delete` | DELETE | `/1/labels/{id}` | Delete a Label |
| `api:labels:by-id:get` | GET | `/1/labels/{id}` | Get a Label |
| `api:labels:by-id:put` | PUT | `/1/labels/{id}` | Update a Label |
| `api:labels:post` | POST | `/1/labels` | Create a Label |
| `api:lists:by-id:actions:get` | GET | `/1/lists/{id}/actions` | Get Actions for a List |
| `api:lists:by-id:archiveAllCards:post` | POST | `/1/lists/{id}/archiveAllCards` | Archive all Cards in List |
| `api:lists:by-id:board:get` | GET | `/1/lists/{id}/board` | Get the Board a List is on |
| `api:lists:by-id:by-field:put` | PUT | `/1/lists/{id}/{field}` | Update a field on a List |
| `api:lists:by-id:cards:get` | GET | `/1/lists/{id}/cards` | Get Cards in a List |
| `api:lists:by-id:closed:put` | PUT | `/1/lists/{id}/closed` | Archive or unarchive a list |
| `api:lists:by-id:get` | GET | `/1/lists/{id}` | Get a List |
| `api:lists:by-id:idBoard:put` | PUT | `/1/lists/{id}/idBoard` | Move List to Board |
| `api:lists:by-id:moveAllCards:post` | POST | `/1/lists/{id}/moveAllCards` | Move all Cards in List |
| `api:lists:by-id:put` | PUT | `/1/lists/{id}` | Update a List |
| `api:lists:post` | POST | `/1/lists` | Create a new List |
| `api:members:by-id:actions:get` | GET | `/1/members/{id}/actions` | Get a Member's Actions |
| `api:members:by-id:avatar:post` | POST | `/1/members/{id}/avatar` | Create Avatar for Member |
| `api:members:by-id:boardBackgrounds:by-idBackground:delete` | DELETE | `/1/members/{id}/boardBackgrounds/{idBackground}` | Delete a Member's custom Board background |
| `api:members:by-id:boardBackgrounds:by-idBackground:get` | GET | `/1/members/{id}/boardBackgrounds/{idBackground}` | Get a boardBackground of a Member |
| `api:members:by-id:boardBackgrounds:by-idBackground:put` | PUT | `/1/members/{id}/boardBackgrounds/{idBackground}` | Update a Member's custom Board background |
| `api:members:by-id:boardBackgrounds:get` | GET | `/1/members/{id}/boardBackgrounds` | Get Member's custom Board backgrounds |
| `api:members:by-id:boardBackgrounds:post` | POST | `/1/members/{id}/boardBackgrounds` | Upload new boardBackground for Member |
| `api:members:by-id:boardStars:by-idStar:delete` | DELETE | `/1/members/{id}/boardStars/{idStar}` | Delete Star for Board |
| `api:members:by-id:boardStars:by-idStar:get` | GET | `/1/members/{id}/boardStars/{idStar}` | Get a boardStar of Member |
| `api:members:by-id:boardStars:by-idStar:put` | PUT | `/1/members/{id}/boardStars/{idStar}` | Update the position of a boardStar of Member |
| `api:members:by-id:boardStars:get` | GET | `/1/members/{id}/boardStars` | Get a Member's boardStars |
| `api:members:by-id:boardStars:post` | POST | `/1/members/{id}/boardStars` | Create Star for Board |
| `api:members:by-id:boards:get` | GET | `/1/members/{id}/boards` | Get Boards that Member belongs to |
| `api:members:by-id:boardsInvited:get` | GET | `/1/members/{id}/boardsInvited` | Get Boards the Member has been invited to |
| `api:members:by-id:by-field:get` | GET | `/1/members/{id}/{field}` | Get a field on a Member |
| `api:members:by-id:cards:get` | GET | `/1/members/{id}/cards` | Get Cards the Member is on |
| `api:members:by-id:customBoardBackgrounds:by-idBackground:delete` | DELETE | `/1/members/{id}/customBoardBackgrounds/{idBackground}` | Delete custom Board Background of Member |
| `api:members:by-id:customBoardBackgrounds:by-idBackground:get` | GET | `/1/members/{id}/customBoardBackgrounds/{idBackground}` | Get custom Board Background of Member |
| `api:members:by-id:customBoardBackgrounds:by-idBackground:put` | PUT | `/1/members/{id}/customBoardBackgrounds/{idBackground}` | Update custom Board Background of Member |
| `api:members:by-id:customBoardBackgrounds:get` | GET | `/1/members/{id}/customBoardBackgrounds` | Get a Member's custom Board Backgrounds |
| `api:members:by-id:customBoardBackgrounds:post` | POST | `/1/members/{id}/customBoardBackgrounds` | Create a new custom Board Background |
| `api:members:by-id:customEmoji:by-idEmoji:get` | GET | `/1/members/{id}/customEmoji/{idEmoji}` | Get a Member's custom Emoji |
| `api:members:by-id:customEmoji:get` | GET | `/1/members/{id}/customEmoji` | Get a Member's customEmojis |
| `api:members:by-id:customEmoji:post` | POST | `/1/members/{id}/customEmoji` | Create custom Emoji for Member |
| `api:members:by-id:customStickers:by-idSticker:delete` | DELETE | `/1/members/{id}/customStickers/{idSticker}` | Delete a Member's custom Sticker |
| `api:members:by-id:customStickers:by-idSticker:get` | GET | `/1/members/{id}/customStickers/{idSticker}` | Get a Member's custom Sticker |
| `api:members:by-id:customStickers:get` | GET | `/1/members/{id}/customStickers` | Get Member's custom Stickers |
| `api:members:by-id:customStickers:post` | POST | `/1/members/{id}/customStickers` | Create custom Sticker for Member |
| `api:members:by-id:get` | GET | `/1/members/{id}` | Get a Member |
| `api:members:by-id:notificationChannelSettings:by-channel:by-blockedKeys:put` | PUT | `/1/members/{id}/notificationChannelSettings/{channel}/{blockedKeys}` | Update blocked notification keys of Member on a channel |
| `api:members:by-id:notificationChannelSettings:by-channel:get` | GET | `/1/members/{id}/notificationChannelSettings/{channel}` | Get blocked notification keys of Member on this channel |
| `api:members:by-id:notificationChannelSettings:by-channel:put` | PUT | `/1/members/{id}/notificationChannelSettings/{channel}` | Update blocked notification keys of Member on a channel |
| `api:members:by-id:notificationChannelSettings:get` | GET | `/1/members/{id}/notificationChannelSettings` | Get a Member's notification channel settings |
| `api:members:by-id:notificationChannelSettings:put` | PUT | `/1/members/{id}/notificationChannelSettings` | Update blocked notification keys of Member on a channel |
| `api:members:by-id:notifications:get` | GET | `/1/members/{id}/notifications` | Get Member's Notifications |
| `api:members:by-id:oneTimeMessagesDismissed:post` | POST | `/1/members/{id}/oneTimeMessagesDismissed` | Dismiss a message for Member |
| `api:members:by-id:organizations:get` | GET | `/1/members/{id}/organizations` | Get Member's Organizations |
| `api:members:by-id:organizationsInvited:get` | GET | `/1/members/{id}/organizationsInvited` | Get Organizations a Member has been invited to |
| `api:members:by-id:put` | PUT | `/1/members/{id}` | Update a Member |
| `api:members:by-id:savedSearches:by-idSearch:delete` | DELETE | `/1/members/{id}/savedSearches/{idSearch}` | Delete a saved search |
| `api:members:by-id:savedSearches:by-idSearch:get` | GET | `/1/members/{id}/savedSearches/{idSearch}` | Get a saved search |
| `api:members:by-id:savedSearches:by-idSearch:put` | PUT | `/1/members/{id}/savedSearches/{idSearch}` | Update a saved search |
| `api:members:by-id:savedSearches:get` | GET | `/1/members/{id}/savedSearches` | Get Member's saved searched |
| `api:members:by-id:savedSearches:post` | POST | `/1/members/{id}/savedSearches` | Create saved Search for Member |
| `api:members:by-id:tokens:get` | GET | `/1/members/{id}/tokens` | Get Member's Tokens |
| `api:notifications:all:read:post` | POST | `/1/notifications/all/read` | Mark all Notifications as read |
| `api:notifications:by-id:board:get` | GET | `/1/notifications/{id}/board` | Get the Board a Notification is on |
| `api:notifications:by-id:by-field:get` | GET | `/1/notifications/{id}/{field}` | Get a field of a Notification |
| `api:notifications:by-id:card:get` | GET | `/1/notifications/{id}/card` | Get the Card a Notification is on |
| `api:notifications:by-id:get` | GET | `/1/notifications/{id}` | Get a Notification |
| `api:notifications:by-id:list:get` | GET | `/1/notifications/{id}/list` | Get the List a Notification is on |
| `api:notifications:by-id:member:get` | GET | `/1/notifications/{id}/member` | Get the Member a Notification is about (not the creator) |
| `api:notifications:by-id:memberCreator:get` | GET | `/1/notifications/{id}/memberCreator` | Get the Member who created the Notification |
| `api:notifications:by-id:organization:get` | GET | `/1/notifications/{id}/organization` | Get a Notification's associated Organization |
| `api:notifications:by-id:put` | PUT | `/1/notifications/{id}` | Update a Notification's read status |
| `api:notifications:by-id:unread:put` | PUT | `/1/notifications/{id}/unread` | Update Notification's read status |
| `api:organizations:by-id:actions:get` | GET | `/1/organizations/{id}/actions` | Get Actions for Organization |
| `api:organizations:by-id:boards:get` | GET | `/1/organizations/{id}/boards` | Get Boards in an Organization |
| `api:organizations:by-id:by-field:get` | GET | `/1/organizations/{id}/{field}` | Get field on Organization |
| `api:organizations:by-id:delete` | DELETE | `/1/organizations/{id}` | Delete an Organization |
| `api:organizations:by-id:exports:get` | GET | `/1/organizations/{id}/exports` | Retrieve Organization's Exports |
| `api:organizations:by-id:exports:post` | POST | `/1/organizations/{id}/exports` | Create Export for Organizations |
| `api:organizations:by-id:get` | GET | `/1/organizations/{id}` | Get an Organization |
| `api:organizations:by-id:logo:delete` | DELETE | `/1/organizations/{id}/logo` | Delete Logo for Organization |
| `api:organizations:by-id:logo:post` | POST | `/1/organizations/{id}/logo` | Update logo for an Organization |
| `api:organizations:by-id:members:by-idMember:all:delete` | DELETE | `/1/organizations/{id}/members/{idMember}/all` | Remove a Member from an Organization and all Organization Boards |
| `api:organizations:by-id:members:by-idMember:deactivated:put` | PUT | `/1/organizations/{id}/members/{idMember}/deactivated` | Deactivate or reactivate a member of an Organization |
| `api:organizations:by-id:members:by-idMember:delete` | DELETE | `/1/organizations/{id}/members/{idMember}` | Remove a Member from an Organization |
| `api:organizations:by-id:members:by-idMember:put` | PUT | `/1/organizations/{id}/members/{idMember}` | Update a Member of an Organization |
| `api:organizations:by-id:members:get` | GET | `/1/organizations/{id}/members` | Get the Members of an Organization |
| `api:organizations:by-id:members:put` | PUT | `/1/organizations/{id}/members` | Update an Organization's Members |
| `api:organizations:by-id:memberships:by-idMembership:get` | GET | `/1/organizations/{id}/memberships/{idMembership}` | Get a Membership of an Organization |
| `api:organizations:by-id:memberships:get` | GET | `/1/organizations/{id}/memberships` | Get Memberships of an Organization |
| `api:organizations:by-id:newBillableGuests:by-idBoard:get` | GET | `/1/organizations/{id}/newBillableGuests/{idBoard}` | Get Organizations new billable guests |
| `api:organizations:by-id:pluginData:get` | GET | `/1/organizations/{id}/pluginData` | Get the pluginData Scoped to Organization |
| `api:organizations:by-id:prefs:associatedDomain:delete` | DELETE | `/1/organizations/{id}/prefs/associatedDomain` | Remove the associated Google Apps domain from a Workspace |
| `api:organizations:by-id:prefs:orgInviteRestrict:delete` | DELETE | `/1/organizations/{id}/prefs/orgInviteRestrict` | Delete the email domain restriction on who can be invited to the Workspace |
| `api:organizations:by-id:put` | PUT | `/1/organizations/{id}` | Update an Organization |
| `api:organizations:by-id:tags:by-idTag:delete` | DELETE | `/1/organizations/{id}/tags/{idTag}` | Delete an Organization's Tag |
| `api:organizations:by-id:tags:get` | GET | `/1/organizations/{id}/tags` | Get Tags of an Organization |
| `api:organizations:by-id:tags:post` | POST | `/1/organizations/{id}/tags` | Create a Tag in Organization |
| `api:organizations:post` | POST | `/1/organizations` | Create a new Organization |
| `api:plugins:by-id:compliance:memberPrivacy:get` | GET | `/1/plugins/{id}/compliance/memberPrivacy` | Get Plugin's Member privacy compliance |
| `api:plugins:by-id:get` | GET | `/1/plugins/{id}/` | Get a Plugin |
| `api:plugins:by-id:put` | PUT | `/1/plugins/{id}/` | Update a Plugin |
| `api:plugins:by-idPlugin:listings:by-idListing:put` | PUT | `/1/plugins/{idPlugin}/listings/{idListing}` | Updating Plugin's Listing |
| `api:plugins:by-idPlugin:listings:post` | POST | `/1/plugins/{idPlugin}/listings` | Create a Listing for Plugin |
| `api:search:get` | GET | `/1/search` | Search Trello |
| `api:search:members:get` | GET | `/1/search/members/` | Search for Members |
| `api:tokens:by-token:delete` | DELETE | `/1/tokens/{token}/` | Delete a Token |
| `api:tokens:by-token:get` | GET | `/1/tokens/{token}` | Get a Token |
| `api:tokens:by-token:member:get` | GET | `/1/tokens/{token}/member` | Get Token's Member |
| `api:tokens:by-token:webhooks:by-idWebhook:delete` | DELETE | `/1/tokens/{token}/webhooks/{idWebhook}` | Delete a Webhook created by Token |
| `api:tokens:by-token:webhooks:by-idWebhook:get` | GET | `/1/tokens/{token}/webhooks/{idWebhook}` | Get a Webhook belonging to a Token |
| `api:tokens:by-token:webhooks:by-idWebhook:put` | PUT | `/1/tokens/{token}/webhooks/{idWebhook}` | Update a Webhook created by Token |
| `api:tokens:by-token:webhooks:get` | GET | `/1/tokens/{token}/webhooks` | Get Webhooks for Token |
| `api:tokens:by-token:webhooks:post` | POST | `/1/tokens/{token}/webhooks` | Create Webhooks for Token |
| `api:webhooks:by-id:by-field:get` | GET | `/1/webhooks/{id}/{field}` | Get a field on a Webhook |
| `api:webhooks:by-id:delete` | DELETE | `/1/webhooks/{id}` | Delete a Webhook |
| `api:webhooks:by-id:get` | GET | `/1/webhooks/{id}` | Get a Webhook |
| `api:webhooks:by-id:put` | PUT | `/1/webhooks/{id}` | Update a Webhook |
| `api:webhooks:post` | POST | `/1/webhooks/` | Create a Webhook |
