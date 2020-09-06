
export interface MatchResult {
	responseText: string;
	isMatch: boolean;
}
export type CommandAction = 'Add' | 'Remove';
export interface CreditCommand {
	action: CommandAction;
	targetName: string;
	justification: string;
}

export interface IMatchBot {
	match: (text: string) => MatchResult
}

// Need to also create match bot for:
// help
// individual credits
// credit summary

export class CommandMatchBot implements IMatchBot {

	public match(text: string) {
		const command = this.getCommand(text);
		if(command == null){
			return {isMatch: false, responseText: ''};
		}

		// todo: get user by name

		return {isMatch: true, responseText: 'Credits updated for ' + command.targetName};
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
			targetName: runningText.substr(0, runningText.indexOf('|')),
			justification: runningText.substr(runningText.indexOf('|') + 1),
		}
		return command;
	}
}
