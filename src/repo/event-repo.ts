import { query } from "../db"
import { updateBalance } from "./user-repo";

export type EventType = 'Add' | 'Remove'

export interface IEvent {
	type: EventType,
	initiatorId: string,
	targetId: string,
	value: number,
	createdOn: Date
}

export const saveEvent = async (event: IEvent) => {
	const sql = 'insert into public.event (type, initiator_id, target_id, value, created_on) values ($1, $2, $3, $4, now())'
	const result = await query(sql, [event.type, event.initiatorId, event.targetId, event.value]);
}

export const handleEvent = async (event: IEvent) => {
	switch(event.type){
		case 'Add':
			await updateBalance(event.targetId, event.value);
			break;
		case 'Remove':
			await updateBalance(event.targetId, -event.value);
			break;
		default:
			throw Error(`Event Type ${event.type} not implemented.`)
	}
} 