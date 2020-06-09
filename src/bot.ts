import HTTPS from 'https';
import cool from 'cool-ascii-faces';
import {Request, Response} from 'express';
import { SmoothBot, TriggerWordsBot } from './smooth-bot';


interface CoolRequest {
  text: string;
}

export interface CustomRequest<T> extends Request {
  body: T;
}

export function respond(req: CustomRequest<CoolRequest>, res: Response) {
  const body = req.body;
  const botRegex = /^\/cool guy$/;
  // botRegex.test(body.text)
  // const botResponse = cool();

  if(body.text) {
    let match = new TriggerWordsBot().match(body.text);
    if(!match.isMatch){
      match = new SmoothBot().match(body.text);
    }
    if(match.isMatch){
      res.writeHead(200);
      const message = postMessage(match.responseText);
      res.end(message);
      return;
    }
  }
  console.log("don't care");
  res.writeHead(200);
  res.end();
}

function postMessage(botResponse: string) {
  const options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  const body = {
    "bot_id" : process.env.BOT_ID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + process.env.BOT_ID);

  if(process.env.ENABLE_GROUPME === "true") {
    const botReq = HTTPS.request(options, (res) => {
        if(res.statusCode === 202) {
          // neat
        } else {
          console.log('rejecting bad status code ' + res.statusCode);
        }
    });

    botReq.on('error', (err) => {
      console.log('error posting message '  + JSON.stringify(err));
    });
    botReq.on('timeout', (err: any) => {
      console.log('timeout posting message '  + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
  }

  return botResponse;
}


