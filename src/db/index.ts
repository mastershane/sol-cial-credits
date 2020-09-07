import { Pool, QueryResult } from 'pg';
import { env } from 'process';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const query = async (text: string, params: any ) => {
	const start = Date.now();
	const res =  await pool.query(text, params);
	const duration = Date.now() - start;
	console.log('executed query', { text, duration, rows: res.rowCount });
	return res;
};
