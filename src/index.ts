
import  express    from 'express';
import * as bot from './bot';
import bodyParser from 'body-parser';
import dotEnv from 'dotenv';

dotEnv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/', (req, res) => {
  // res.writeHead(200);
  res.send("Hey, I'm Cool Guy.");
});

app.post('/', bot.respond);

const port = Number(process.env.PORT || 5654);
app.listen(port)

