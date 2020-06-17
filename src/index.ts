
import  express    from 'express';
import {MessageMatchBotRunner} from './bot';
import bodyParser from 'body-parser';
import dotEnv from 'dotenv';
import { TriggerWordsBot, SmoothBot } from './smooth-bot';

dotEnv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', (req, res) => {
  // res.writeHead(200);
  res.send("Hey, I'm Cool Guy.");
});

app.post('/', new MessageMatchBotRunner([new TriggerWordsBot(), new SmoothBot()]).respond);

const port = Number(process.env.PORT || 5654);
app.listen(port)

