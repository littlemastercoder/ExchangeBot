<h1>FAQ</h1>

<h2>Question: Are there any built-in limitations or scale caps?</h2>

<p><strong>Answer:</strong> Currently, this project relies on two free public APIs to check prices, meaning it may be slow and not able to handle multiple user queries at the same time. There is currently no DB hooked up to it or DoS protection. Currently we do not have a server host and Exchange Bot is not active. </p>


<h2>Question: Why is the bot not working for me? How do I even access it?</h2>
<p><strong>Answer:</strong> You need to go to the <a href="https://discord.com/developers/applications/">Discord Developer Portal</a> and set up am application. Generate a token and client ID and put them in a .env file on your machine (do not add it to Github as anyone will be able to access your app and do anything with it). Then, you have to generate an OAuth URL with permissions outlined in <code>README.md</code></p>
