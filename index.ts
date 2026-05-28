//@ts-ignore
import { Client, GatewayIntentBits } from 'discord.js';
//@ts-ignore
import { SlashCommandBuilder } from 'discord.js';
//@ts-ignore
import { REST, Routes } from 'discord.js';
//@ts-ignore
import * as dotenv from 'dotenv';
//@ts-ignore
import { spawn } from 'child_process';

dotenv.config();

// SETUP
// ADD THE ALERT FUNC
// git test hello?????
//test2

// ADD PRIVACY POLICY AND ToS
// CHECK IF APIs ARE LEGAL FOR LARGE-SCALE USE
let contactinfo = "gargstudios@protonmail.com";
let updatelog = "Alpha 1.1 - Added Currency Conversion 5/14/26\n" +
    "\n" +
    "Alpha 1.2 - Added !contactinfo, !help, !contact, and !contactdev for getting in touch. 5/15/26\n" +
    "\n" +
    "Alpha 1.1.3 - Added !update command to see updates 5/15/26\n" +
    "\n" +
    "Alpha 1.2 - Added More Stock Info: 52 week range, company name, exchange, and 1D percentage 5/16/26\n" +
    "\n" +
    "Alpha 1.3 - Added crypto checking 5/17/26\n\n"+ "Alpha 1.4 - Implemented Slash Commands to replace on message create commands for privacy purposes";
let website = "https://sites.google.com/view/garg-studios/exchange-bot?authuser=0";
// creater client constructor
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // server info
        GatewayIntentBits.GuildMessages, // when someone sends a messsage
        GatewayIntentBits.MessageContent //  the contents of those messages
    ]
});


// registers and logs to console any error
client.once('ready', async function() { //event listener
    console.log("Client Ready");
    try {
        console.log("Registering commands");
        await register();
        console.log("Commands Registered");
    } catch (e) {
        console.error("Registration error:", e);
    }
});

// when a message is sent further action may be determined
// MIGRATE TO SLASH COMMANDS
/*
client.on('messageCreate', function(message) {
    // ping pong easter egg
    if (message.content.toLowerCase() === 'ping') {
        message.reply('Pong!');
        console.log("Ping pong easter egg triggered");
    }
    //contact info
    // UPDATE COMMAND LISTS
    // command list

    if (message.content.toLowerCase() === "!commands" || message.content.toLowerCase() === "!commandlist") {
        message.reply("Command List\n1. !contactinfo, !help, !contact, and !contactdev give contact information so you can contact us\n2. /checkstock shows information about a stock\n3. /convertcurrency allows you to convert currency\n4. !update to see the last update and the update we're working on");
        console.log("Command list displayed");
    }
    // gives info about the current and next update
    // DONE IN SLASH COMMANDS

}); */

const pingpong = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping!")

const update = new SlashCommandBuilder()
    .setName("update")
    .setDescription("Check the update log for Exchange Bot")

const contactdev = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Contact info to contact devs about problems")

const data = new SlashCommandBuilder() // stock checker
    .setName('checkstock')
    .setDescription('Get stock data')
    .addStringOption(option =>
        option.setName('ticker')
            .setDescription('The stock symbol (e.g., AAPL)')
            .setRequired(true)
    );

const data2 = new SlashCommandBuilder() // currency checker
    .setName('convertcurrency')
    .setDescription('Convert currency')
    .addStringOption(option =>
        option.setName('currency1')
            .setDescription("The currency you are converting from")
            .setRequired(true)
    )
    .addNumberOption(option =>
        option.setName("currencyamount")
            .setDescription("The amount of currency you're converting")
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("currency2")
            .setDescription("The currency you are converting TO")
            .setRequired(true)
    );

const cryptodata = new SlashCommandBuilder()
    .setName("checkcrypto")
    .setDescription("Check the price of a crypto ")
    .addStringOption(option =>
        option.setName("crypto")
            .setDescription("The crypto you are checking (use formatting like BTC, ETH, SOL)")
            .setRequired(true)
    );




async function register() {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID!),
        { body: [data.toJSON(), data2.toJSON(), cryptodata.toJSON(), contactdev.toJSON(), update.toJSON(), pingpong.toJSON()] }
    );
}
client.on('interactionCreate', async function(interaction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'checkstock') {
        await interaction.deferReply();

        const ticker = interaction.options.getString('ticker');
        if (ticker == null){
            interaction.editReply("Error. Ticker is null or undefined.");
            console.log("Null ticker")
        }

        // 2. Run your Python logic
        const python = spawn('python', ['logic.py', ticker!]);

        python.stdout.on('data', function(data) {
            interaction.editReply(`📈 Stock Price: ${data.toString()}`);
            console.log(`Stock price displayed: ${data.toString()}`);
        });
        python.stderr.on('data', function(data) {
            console.error(`Python Error: ${data}`);
            interaction.editReply("❌ Error.");
        });
    }

    else if (interaction.commandName === "ping") {
        await interaction.deferReply();
        console.log("Ping Pong Triggered!");
        interaction.editReply("Pong!")
    }

    else if (interaction.commandName === "update") {
        await interaction.deferReply();
        console.log("Update log command used");
        interaction.editReply(updatelog)
    }

    else if (interaction.commandName === "help") {
        await interaction.deferReply();
        console.log("Help command used");
        interaction.editReply("Please email us at " + contactinfo+"\nOur Website: " + website); // email
    }




    else if (interaction.commandName === 'convertcurrency') {
        console.log("Convert currency command used");
        await interaction.deferReply();
        console.log("interaction command used");
        const currency1 = interaction.options.getString('currency1');
        const currencyAmount = interaction.options.getNumber('currencyamount');
        const currency2 = interaction.options.getString('currency2');
        console.log("values stored");

        if (currencyAmount == null) {
            interaction.editReply("Error. Ticker is null or undefined.");
            console.log("Null ticker")
        }
        console.log("Null check passed");


        const python = spawn('python', ['-u','exchangerates.py', currency1!, currencyAmount!.toString(), currency2!], {})
        let output = "";
        console.log("const python initiatiized");
        python.stdout.on('data', function(data) { //culprit
            console.log("python stdout on");
            output += (`${data.toString()}`);
            console.log(`Added to output: ${data.toString()}`);
        });

        // makes sure the full output is returned
        python.on('close', async function(code) {
            if (output.trim() === '') {
                await interaction.editReply("Error: Python returned blank data. Please run !help to contact a developer.");
                console.log("Python returned blank data");
            } else {
                await interaction.editReply(output);
                console.log(`Displayed: ${output}`);
            }
        });
        python.stderr.on('data', function(data) {
            console.error(`Python Error: ${data}`);
            interaction.editReply("❌ Python Error. Please type !help to contact a developer.");
        });

    }




    else if (interaction.commandName === "checkcrypto") {
        console.log("/checkcrypto used");
        await interaction.deferReply();
        const cryptosymbol = interaction.options.getString('crypto');
        console.log("Crypto value stored");
        if (cryptosymbol == null){
            interaction.editReply("Null ticker is not acceptable");
            console.log("Null ticker")

        }
        const python = spawn('python', ['-u','crypto.py', cryptosymbol!], {})
        let output = "";
        console.log("const python init");
        python.stdout.on('data', function(data){
            console.log("python stdout on");
            output += `${data.toString()}`
            console.log(`Added to output: ${data.toString}`)
            }
        );
        python.on('close', async function(code){
            if (output.trim() === '') {
                await interaction.editReply("Error: Python returned blank data. Please run !help to contact a developer.");
                console.log("Python returned blank data");
            } else {
                await interaction.editReply(output);
                console.log(`Displayed: ${output}`);
            }
        });
        python.stderr.on('data', function(data) {
            console.error(`Python Error: ${data}`);
            interaction.editReply("❌ Python Error. Please type !help to contact a developer.");
        });


        // TO TEST AND ADD CURRENCY CONVERSION

    }
});



client.login(process.env.DISCORD_TOKEN);