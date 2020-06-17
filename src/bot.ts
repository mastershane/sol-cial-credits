import HTTPS from 'https';
import {Request, Response} from 'express';
import { IMatchBot } from './smooth-bot';


interface GroupMeRequest {
  text: string;
  sender_type: 'user' | 'bot',
}

export interface CustomRequest<T> extends Request {
  body: T;
}

export class MessageMatchBotRunner {
  private _bots: IMatchBot[]
  constructor(bots: IMatchBot[]) {
    this._bots = bots;
    this.respond = this.respond.bind(this);
  }

  public respond(req: CustomRequest<GroupMeRequest>, res: Response) {
    const body = req.body;

    // without this check the bot will just trigger itself over and over
    if(body.sender_type !== "user"){
      res.writeHead(200);
      res.end();
      return;
    }

    if(body.text) {
      for(const bot of this._bots){
        const match = bot.match(body.text);
        if(match.isMatch){
          res.writeHead(200);
          const message = this.postMessage(match.responseText);
          res.end(message);
          return;
        }
      }
    }
    console.log("don't care");
    res.writeHead(200);
    res.end();
  };

  private postMessage(botResponse: string) {
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
}
