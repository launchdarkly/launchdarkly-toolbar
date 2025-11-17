# Auth Flow Changes - Summary

This document summarizes the changes and decisions made in providing an auth-first Developer Toolbar experience, and justifies these changes by
adding useful context.

## Background

To unlock new features and empower developers to use LaunchDarkly from within their local frontend application, we need to have a mechanism to authenticate the
LaunchDarkly Developer Toolbar with a user's LaunchDarkly account. Doing so allows the toolbar to make authenticated API calls and unlocks a plethora of
possible new features.

## Overview

To provide a unified experience, both from a usage perspective and from a development perspective, we have opted to enforce an auth-first experience for the 
Developer Toolbar. What this means is that moving from v1.x -> v2.0 will require users to first authenticate + authorize the Developer Toolbar in order to use it. Functionally, this means that we can simplify the code we are developing for the toolbar so we don't need to handle both the authenticated experience as well as the unauthenticated experience, instead providing and supporting one experience.

### Project Selection

One of the new changes with adding authentication is the capability for the toolbar to choose a Project based on the API. Prior, this was an optional prop
for Dev Server Mode, related to auto-configuring what project in the Dev Server the toolbar should connect to. This is being changed so that we can have a
single source of truth via the `ProjectProvider`. This is driven by the API now, meaning the Project Selector in the Settings tab houses all projects tied to
the user's LaunchDarkly account.

To help ensure an easy, intuitive experience, we have added two props to the toolbar so user's can help ensure the toolbar auto-selects the correct project
based on the configuration of their LD Client SDK:
1. `projectKey` - The Project Key. If provided, the toolbar will find the matching project from `getProjects` API call. Takes precedence over `clientSideId`.
2. `clientSideId` - The Client-Side ID used by the LD Client SDK. If provided, the toolbar will find the corresponding project and select it.

If neither `projectKey` or `clientSideId` are provided, the toolbar will auto-select the first project it gets back from the API call to get projects. It is
recommended to provide one of these props, as without them, we cannot guarantee the toolbar will select the correct project. If neither prop is passed in
and the toolbar does not select the correct project, user's will have to navigate to the Settings tab and select the correct project.

### Feature Flag Loading

Another new change we have unlocked with adding authentication is the ability to fetch feature flag data from the API. A simple change this allows us to do
is to get the exact name for a Feature Flag, instead of inferring it based on the key. It will also soon empower us to do things like:
* get other variations for flags and turn those into selectable options, rather than open inputs
* show why flags evaluated they way they did

This, however, introduces two places where flag data is loaded, meaning we can potentially have conflicting sources of truth. To help ameliorate this, we are
going to explain distinct boundaries/ownership between the LD Client flags and the API flags.

**LD Client flags**
- Determines the current value of the flag
- If a flag is override, determines the evaluation reason (i.e. evaluated as true because it's overriden)
- all other read data, aside from name (currently). this will change over time

**API flags**
- Evaluation reason (if the flag is not overriden)
- Flag name
- Variations (eventually)

Eventually, as time goes on and more features and built out that utilize the API, the API flags will largely serve as the source of truth aside from
the value + evaluation reason (only if a flag is overriden).