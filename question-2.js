const async = require("async");

const processListOfDataAfterOneSecond = array => {
  // Function to process each item with a delay
  function processItem(item, callback) {
    setTimeout(() => {
      const result = item * 2;
      console.log(`Processed ${item}, Result: ${result}`);
      callback(null, result);
    }, 1000); // 1000 milliseconds = 1 second delay
  }

  // Use async.mapSeries to process the items sequentially
  async.mapSeries(numbers, processItem, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log("All items processed successfully.");
      console.log("Results:", results);
    }
  });
};

const numbers = [1, 3, 5, 6, 3];

processListOfDataAfterOneSecond(numbers);
