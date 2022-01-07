!(Data studio report example)["./img/dsexample.png"]

# Overview

Sheetzapper imports your account value accross Zapper.fi supported wallets and dapps into a Google Sheet. This allows you to chart your net worth over time, which is a feature Zapper does not yet support. So until they do, you can use this!

This tool supports most DeFi protocols as well as NFTs.

This tool is free, easy to set up, and doesn't require a connection to any of your wallets. All you need is a google account and a public address. If you found this useful, no need for any donations or anything, but please give this repo a star so I know that someone found it useful!

# How it works

- Utilizes Zapper.fi's API to pull in data
- You can set up a time based trigger for the sheet to automatically by running `Set up daily import`
- Does not grab historical data, only forward looking

# Set up

1. Copy this sheet
2. Find the Sheetzapper button in the menu bar. It may take ~20 seconds for it to appear after copying.
3. In the dropdown, click "First time setup". This will prompt an authorization window. Click continue -> Select your google account -> When you see "Google hasn’t verified this app", click "advanced" -> Go to Sheetzapper (unsafe). This message is just appearing because Google hasn't verified this code. You can and should read through it yourself before proceeding if you're concerned.
4. Run "First time setup" again. The first time triggers the auth, this second time actually runs the function. You'll know it's set up properly once you get a message that says "If you see this message, setup is complete"
5. Sheetzapper -> Setup daily import. This automates the tool to pull in your data every day.
6. To check your current balances, click Sheetzapper -> Current Account Balances. The Zapper endpoint can take a little while since it is checking your wallets against all of its supported apps.
7. There will be some pre-built charts in the Charts tab, but for nicer data visualizations you can copy this data studio report and then connect it to your own sheet. Click copy ->

# What wallets/dapps are supported?

Check the zapperapps_jan6_2022.json file to see all supported dapps as of 1/6/22. You can also check the zapper endpoint at a later date to see if they have added any new ones.
