import { GroupMeRequest, Mention } from "./bot";
import { getUser, getUsers } from "./repo/user-repo";
import { IEvent, saveEvent, handleEvent } from "./repo/event-repo";

export interface MatchResult {
	responseText: string;
	isMatch: boolean;
}
export type CommandAction = 'Add' | 'Remove';
export interface CreditCommand {
	action: CommandAction;
	justification: string;
	targets: string[];
}

export interface IMatchBot {
	match: (message: GroupMeRequest) => Promise<MatchResult>
}


export class InfoMatchBot implements IMatchBot {
	public async match(message: GroupMeRequest) {
		if (message.text.startsWith('!balance')) {
			const user = await getUser(message.user_id);
			return {isMatch: true, responseText: `Your current balance is ${user.balance}` };
		}

		if(message.text.startsWith('!ranking')){
			const users = await getUsers();
			users.sort((a, b) => {
				return b.balance - a.balance;
			});
			const text = users.map(u => u.name + ": " + u.balance).join('\r\n');
			return {isMatch: true, responseText: text };
		}

		return {isMatch: false, responseText: '' };

	};
}

// tslint:disable-next-line: max-classes-per-file
export class CommandMatchBot implements IMatchBot {

	public async match(message: GroupMeRequest) {
		const mentions = message.attachments.find(m => m.type === 'mentions') as Mention;
		if(!mentions) {
			return {isMatch: false, responseText: ''};
		}

		const command = this.getCommand(message.text);
		if(command == null){
			return {isMatch: false, responseText: ''};
		}

		command.targets = mentions.user_ids;

		// get initaitor user from repo
		const initiator = await getUser(message.user_id);
		const points = Math.round(initiator.balance / 100);
		command.targets.forEach(async target => {
			const event: IEvent = {
				type: command.action,
				initiatorId: message.user_id,
				targetId: target,
				value: points,
				createdOn: new Date(),
				text: command.justification,
			}
			await saveEvent(event);
			await handleEvent(event);
		});
		const targetNames = await Promise.all(command.targets.map(async t => (await getUser(t)).name));

		return {isMatch: true, responseText: ` ${points} credits ${command.action === 'Add' ? 'added to' : 'removed from' } ${targetNames.join(', ')}` };
	}

	private getCommand(text: string) {

		let runningText = text.trim();
		let isCommand = false;
		let action: CommandAction;
		if(text.startsWith("+cred")){
			isCommand = true;
			action = 'Add';
			runningText = runningText.substr(5);
		}

		if(text.startsWith("-cred")){
			isCommand = true;
			action = 'Remove';
			runningText = runningText.substr(5);
		}

		if(!isCommand){
			return null;
		}

		const command: CreditCommand = {
			action,
			justification: runningText,
			targets: [],
		}
		return command;
	}
}
