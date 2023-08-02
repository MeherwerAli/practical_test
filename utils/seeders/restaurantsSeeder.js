const Restaurant = require('../../models/Restaurant');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '../../config/config.env') });

const connectDB = require('../../config/db');

connectDB();

async function seedData() {
  // Seed restaurants
  const restaurant1 = new Restaurant({
    name: 'Restaurant 5',
    address: '123 Main St',
    cuisine: 'Italian',
    location: {
      type: 'Point',
      coordinates: [25.0731, 55.298]
    }
  });

  const restaurant2 = new Restaurant({
    name: 'Restaurant 6',
    address: '422 Broadway',
    cuisine: 'Indian',
    location: {
      type: 'Point',
      coordinates: [55.298, 25.0731]
    }
  });

  await restaurant1.save();
  await restaurant2.save();
}

async function destroyData() {
  await Restaurant.deleteMany();
  console.log('Data destroyed'.red.inverse);
}

(async function () {
  if (process.argv.length === 3) {
    const command = process.argv[2];

    try {
      if (command === '--import') {
        await seedData();
        console.log('Data imported'.green.inverse);
        process.exit();
      } else if (command === '--destroy') {
        await destroyData();
        process.exit();
      } else {
        console.error(
          'Invalid argument. Use --import to import data or --destroy to wipe out the data.'
            .red
        );
      }
    } catch (error) {
      console.error(`${error}`.red.inverse);
      process.exit(1);
    }
  } else {
    console.error(
      'No argument provided. Use --import to import data or --destroy to wipe out the data.'
        .red
    );
  }
  process.exit(1);
})();
