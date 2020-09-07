
import  express  from 'express';
import {MessageMatchBotRunner} from './bot';
import bodyParser from 'body-parser';
import dotEnv from 'dotenv';
import { CommandMatchBot, InfoMatchBot } from './match-bot';
import { query } from './db';

dotEnv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', async (req, res) => {
  const dbres = await query('SELECT $1::text as message', ['Hello world!'])
  console.log(dbres.rows[0].message) // Hello world!
  res.send("Hey, I'm Cool Guy.");
});

app.post('/', new MessageMatchBotRunner([new InfoMatchBot(), new CommandMatchBot()]).respond);

const port = Number(process.env.PORT || 5654);
app.listen(port)

