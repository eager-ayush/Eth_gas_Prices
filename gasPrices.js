const Web3 = require('web3');
const {DateTime} = require('luxon');

const web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/1O0b0U3wU_3pW7XDKegW4BVi5RwhvHB1'); 

// Set the date and time to query

const start_time = DateTime.fromObject({year:2023 , month:5 , day:5});
const end_time = DateTime.fromObject({year:2023 , month:5 , day:7});

// Gets transactions within the time period

const block_number_start = web3.eth.getBlockNumber(start_time.toSeconds());
const block_number_end = web3.eth.getBlockNumber(end_time.toSeconds());

const transactions = [];

for(let block_number=0 ; block_number<=block_number_end ; block_number++){
    const block = web3.eth.getBlock(block_number , true);
    if(block!==0 && block.transactions.length>0){
        for(i=0;i<block.transactions.length; i++){
            const tx = block.transactions[i];
            if(tx.timestamp>start_time.toSeconds() && tx.timestamp < end_time.toSeconds()){
                transactions.push(tx);
            }
        }
    }
}

// Calculating the avg. gas price

const gas_prices = transactions.map(tx=> web3.utils.fromWei(tx.gasPrice, 'gwei'));
const sum_gas_prices = gas_prices.reduce((total, price) => total + parseFloat(price), 0);
const average_gas_price = sum_gas_prices / gas_prices.length;

console.log(`The average gas price for ${transactions.length} transactions between ${start_time.toISO()} and ${end_time.toISO()} is: ${average_gas_price} `);

