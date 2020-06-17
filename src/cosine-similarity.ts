// Code is based on the cosine similiarity section of this article https://medium.com/@sumn2u/string-similarity-comparision-in-js-with-examples-4bae35f13968

interface Dictionary<V> {
    [key: string]: V;
}

function termFreqMap(str: string): Dictionary<number> {
	const words = str.split(' ');
	const termFreq:Dictionary<number> = {};
	words.forEach((w) => {
		termFreq[w] = (termFreq[w] || 0) + 1;
	});
	return termFreq;
}

function addKeysToDict(map: Dictionary<number>, dict: Dictionary<boolean>) {

	// tslint:disable-next-line: forin
	for (const key in map) {
		dict[key] = true;
	}
}

function termFreqMapToVector(map: Dictionary<number>, dict: Dictionary<boolean>): number[]  {
	const termFreqVector = [];
	// tslint:disable-next-line: forin
	for (const term in dict) {
		termFreqVector.push(map[term] || 0);
	}
	return termFreqVector;
}

function vecDotProduct(vecA: number[], vecB: number[]) {
	let product = 0;
	for (let i = 0; i < vecA.length; i++) {
		product += vecA[i] * vecB[i];
	}
	return product;
}

function vecMagnitude(vec: number[]) {
	let sum = 0;
	// tslint:disable-next-line: prefer-for-of
	for (let i = 0; i < vec.length; i++) {
		sum += vec[i] * vec[i];
	}
	return Math.sqrt(sum);
}

function cosineSimilarity(vecA: number[], vecB: number[]) {
	return vecDotProduct(vecA, vecB) / (vecMagnitude(vecA) * vecMagnitude(vecB));
}

function normalizeString(str: string) {
	return str.replace(/[^a-zA-Z ]/g, "").toLowerCase();
}

export function textCosineSimilarity(strA: string, strB: string) {
	const normalizedA = normalizeString(strA);
	const normalizedB = normalizeString(strB);

	const termFreqA = termFreqMap(normalizedA);
	const termFreqB = termFreqMap(normalizedB);

	const dict = {};
	addKeysToDict(termFreqA, dict);
	addKeysToDict(termFreqB, dict);

	const termFreqVecA = termFreqMapToVector(termFreqA, dict);
	const termFreqVecB = termFreqMapToVector(termFreqB, dict);

	return cosineSimilarity(termFreqVecA, termFreqVecB);
}
