import { query } from "../db";

export interface IUser {
	userId: string;
	name: string;
	balance: number;
}

const initialBalance = 10000;

export const getUser = async (userId: string) => {
	const results = await query('SELECT * FROM public.groupme_user WHERE user_id = $1', [userId]);
	const row = results.rows[0];
	const user: IUser =  {
		userId: row.user_id,
		name: row.name,
		balance: row.balance,
	};
	return user;
	// todo: insert a new record if it doesn't exist yet e.g.
	// insert into public.groupme_user (user_id, name, balance)
	// values ('527431', 'Shane', 10000)
};

export const updateBalance = async (userId: string, score: number) => {
	const results = await query('UPDATE public.groupme_user SET balance = balance + $2 WHERE user_id = $1', [userId, score]);
}