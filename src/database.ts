import mongoose from 'mongoose';
import chalk from 'chalk';
import { load } from 'ts-dotenv';

const env = load({
  MONGO_DB_URI: String,
});

mongoose
  .connect(env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`Working on ${chalk.greenBright('local')} ✔`);
    console.log(`${chalk.bgRed('Launched... ')} 🚀`);
  })
  .catch((err) => {
    console.log(err);
  });
