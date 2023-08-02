const connectDB = require('../../config/db');
const User = require('../../models/User');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '../../config/config.env' });
}

connectDB();

async function seedData() {


  // Seed users
  const user1 = new User({
    email: 'user1@cc.com',
    password: 'password123',
  });

  const user2 = new User({
    email: 'user2@cc.com',
    password: 'password123',
  });

  await user1.save();
  await user2.save();
}

async function destroyData() {
  await User.deleteMany();
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
